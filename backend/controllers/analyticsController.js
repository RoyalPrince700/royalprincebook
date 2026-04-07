const AnalyticsEvent = require('../models/AnalyticsEvent');

const TRAFFIC_WINDOW_DAYS = 14;
const TOP_PAGE_WINDOW_DAYS = 30;

const clampNumber = (value) => {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue) || numericValue < 0) {
    return undefined;
  }

  return Math.round(numericValue * 100) / 100;
};

const clampString = (value, maxLength = 200) => {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim().slice(0, maxLength);
};

const detectBrowser = (userAgent = '') => {
  if (/edg/i.test(userAgent)) return 'Edge';
  if (/chrome|crios/i.test(userAgent)) return 'Chrome';
  if (/safari/i.test(userAgent) && !/chrome|crios/i.test(userAgent)) return 'Safari';
  if (/firefox|fxios/i.test(userAgent)) return 'Firefox';
  if (/opr|opera/i.test(userAgent)) return 'Opera';
  return 'Other';
};

const detectOs = (userAgent = '') => {
  if (/windows/i.test(userAgent)) return 'Windows';
  if (/android/i.test(userAgent)) return 'Android';
  if (/iphone|ipad|ipod/i.test(userAgent)) return 'iOS';
  if (/mac os x|macintosh/i.test(userAgent)) return 'macOS';
  if (/linux/i.test(userAgent)) return 'Linux';
  return 'Other';
};

const detectDeviceType = (userAgent = '', viewportWidth) => {
  if (/ipad|tablet/i.test(userAgent)) return 'tablet';
  if (/mobile|iphone|ipod|android/i.test(userAgent)) return 'mobile';
  if (Number.isFinite(viewportWidth) && viewportWidth > 0 && viewportWidth < 900) return 'tablet';
  return 'desktop';
};

const extractReferrerHost = (referrer) => {
  try {
    return new URL(referrer).hostname.replace(/^www\./i, '');
  } catch (_error) {
    return '';
  }
};

const normalizePath = (path = '/') => {
  const value = clampString(path, 200) || '/';
  return value.startsWith('/') ? value : `/${value}`;
};

const startOfDay = (value) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

const addDays = (value, days) => {
  const next = new Date(value);
  next.setDate(next.getDate() + days);
  return next;
};

const buildDateBuckets = (days) => {
  const today = startOfDay(new Date());

  return Array.from({ length: days }, (_item, index) => {
    const date = addDays(today, index - (days - 1));
    const key = date.toISOString().slice(0, 10);

    return {
      key,
      label: new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric'
      }).format(date)
    };
  });
};

const roundMetric = (value) => {
  if (!Number.isFinite(value)) {
    return null;
  }

  return Math.round(value);
};

const trackAnalyticsEvent = async (req, res) => {
  try {
    const {
      type,
      path,
      title,
      referrer,
      visitorId,
      sessionId,
      viewport,
      connectionType,
      metrics
    } = req.body || {};

    if (!['pageview', 'performance'].includes(type)) {
      res.status(400).json({ message: 'Invalid analytics event type.' });
      return;
    }

    if (!path || !visitorId) {
      res.status(400).json({ message: 'Missing analytics path or visitor identifier.' });
      return;
    }

    const width = clampNumber(viewport?.width);
    const userAgent = clampString(req.get('user-agent'), 500);

    await AnalyticsEvent.create({
      type,
      path: normalizePath(path),
      title: clampString(title, 140),
      referrer: clampString(referrer, 500),
      referrerHost: extractReferrerHost(referrer),
      visitorId: clampString(visitorId, 100),
      sessionId: clampString(sessionId, 100),
      userAgent,
      browser: detectBrowser(userAgent),
      os: detectOs(userAgent),
      deviceType: detectDeviceType(userAgent, width),
      viewportWidth: width,
      viewportHeight: clampNumber(viewport?.height),
      connectionType: clampString(connectionType, 50),
      metrics: {
        pageLoadMs: clampNumber(metrics?.pageLoadMs),
        domContentLoadedMs: clampNumber(metrics?.domContentLoadedMs),
        firstContentfulPaintMs: clampNumber(metrics?.firstContentfulPaintMs),
        routeRenderMs: clampNumber(metrics?.routeRenderMs)
      }
    });

    res.status(201).json({ success: true });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    res.status(202).json({ success: false });
  }
};

const getAdminTraffic = async (_req, res) => {
  try {
    const trafficWindowStart = addDays(startOfDay(new Date()), -(TRAFFIC_WINDOW_DAYS - 1));
    const activeVisitorStart = addDays(startOfDay(new Date()), -6);
    const topPagesWindowStart = addDays(startOfDay(new Date()), -(TOP_PAGE_WINDOW_DAYS - 1));

    const [
      totalPageViews,
      uniqueVisitors,
      activeVisitors,
      trafficByDay,
      topPages,
      performanceSummary,
      performanceTrend,
      deviceBreakdown,
      slowPages,
      recentVisits
    ] = await Promise.all([
      AnalyticsEvent.countDocuments({ type: 'pageview' }),
      AnalyticsEvent.distinct('visitorId', { type: 'pageview' }),
      AnalyticsEvent.distinct('visitorId', {
        type: 'pageview',
        createdAt: { $gte: activeVisitorStart }
      }),
      AnalyticsEvent.aggregate([
        {
          $match: {
            type: 'pageview',
            createdAt: { $gte: trafficWindowStart }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$createdAt'
              }
            },
            pageviews: { $sum: 1 },
            visitors: { $addToSet: '$visitorId' }
          }
        }
      ]),
      AnalyticsEvent.aggregate([
        {
          $match: {
            type: 'pageview',
            createdAt: { $gte: topPagesWindowStart }
          }
        },
        {
          $group: {
            _id: '$path',
            views: { $sum: 1 },
            visitors: { $addToSet: '$visitorId' },
            lastSeenAt: { $max: '$createdAt' }
          }
        },
        {
          $project: {
            _id: 0,
            path: '$_id',
            views: 1,
            uniqueVisitors: { $size: '$visitors' },
            lastSeenAt: 1
          }
        },
        { $sort: { views: -1, uniqueVisitors: -1 } },
        { $limit: 6 }
      ]),
      AnalyticsEvent.aggregate([
        { $match: { type: 'performance' } },
        {
          $group: {
            _id: null,
            avgPageLoadMs: { $avg: '$metrics.pageLoadMs' },
            avgDomContentLoadedMs: { $avg: '$metrics.domContentLoadedMs' },
            avgFirstContentfulPaintMs: { $avg: '$metrics.firstContentfulPaintMs' },
            avgRouteRenderMs: { $avg: '$metrics.routeRenderMs' },
            samples: { $sum: 1 }
          }
        }
      ]),
      AnalyticsEvent.aggregate([
        {
          $match: {
            type: 'performance',
            createdAt: { $gte: trafficWindowStart }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$createdAt'
              }
            },
            avgPageLoadMs: { $avg: '$metrics.pageLoadMs' },
            avgFirstContentfulPaintMs: { $avg: '$metrics.firstContentfulPaintMs' },
            avgRouteRenderMs: { $avg: '$metrics.routeRenderMs' }
          }
        }
      ]),
      AnalyticsEvent.aggregate([
        { $match: { type: 'pageview' } },
        {
          $group: {
            _id: '$deviceType',
            value: { $sum: 1 }
          }
        },
        { $sort: { value: -1 } }
      ]),
      AnalyticsEvent.aggregate([
        { $match: { type: 'performance' } },
        {
          $group: {
            _id: '$path',
            avgPageLoadMs: { $avg: '$metrics.pageLoadMs' },
            avgRouteRenderMs: { $avg: '$metrics.routeRenderMs' },
            samples: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            path: '$_id',
            avgPageLoadMs: 1,
            avgRouteRenderMs: 1,
            samples: 1
          }
        },
        { $sort: { avgPageLoadMs: -1, avgRouteRenderMs: -1 } },
        { $limit: 6 }
      ]),
      AnalyticsEvent.find({ type: 'pageview' })
        .sort({ createdAt: -1 })
        .limit(10)
        .select('path title browser os deviceType referrerHost createdAt')
        .lean()
    ]);

    const trafficMap = new Map(
      trafficByDay.map((entry) => [
        entry._id,
        {
          pageviews: entry.pageviews,
          visitors: entry.visitors.length
        }
      ])
    );

    const performanceMap = new Map(
      performanceTrend.map((entry) => [
        entry._id,
        {
          avgPageLoadMs: roundMetric(entry.avgPageLoadMs),
          avgFirstContentfulPaintMs: roundMetric(entry.avgFirstContentfulPaintMs),
          avgRouteRenderMs: roundMetric(entry.avgRouteRenderMs)
        }
      ])
    );

    const dateBuckets = buildDateBuckets(TRAFFIC_WINDOW_DAYS);

    res.json({
      stats: {
        totalPageViews,
        uniqueVisitors: uniqueVisitors.length,
        activeVisitors7d: activeVisitors.length,
        avgPageLoadMs: roundMetric(performanceSummary[0]?.avgPageLoadMs),
        avgDomContentLoadedMs: roundMetric(performanceSummary[0]?.avgDomContentLoadedMs),
        avgFirstContentfulPaintMs: roundMetric(performanceSummary[0]?.avgFirstContentfulPaintMs),
        avgRouteRenderMs: roundMetric(performanceSummary[0]?.avgRouteRenderMs),
        performanceSamples: performanceSummary[0]?.samples || 0
      },
      dailyTraffic: dateBuckets.map((bucket) => ({
        date: bucket.key,
        label: bucket.label,
        pageviews: trafficMap.get(bucket.key)?.pageviews || 0,
        visitors: trafficMap.get(bucket.key)?.visitors || 0
      })),
      performanceTrend: dateBuckets.map((bucket) => ({
        date: bucket.key,
        label: bucket.label,
        avgPageLoadMs: performanceMap.get(bucket.key)?.avgPageLoadMs || 0,
        avgFirstContentfulPaintMs: performanceMap.get(bucket.key)?.avgFirstContentfulPaintMs || 0,
        avgRouteRenderMs: performanceMap.get(bucket.key)?.avgRouteRenderMs || 0
      })),
      topPages: topPages.map((page) => ({
        ...page,
        views: page.views || 0,
        uniqueVisitors: page.uniqueVisitors || 0
      })),
      deviceBreakdown: deviceBreakdown.map((device) => ({
        name: clampString(device._id, 30) || 'unknown',
        value: device.value || 0
      })),
      slowPages: slowPages.map((page) => ({
        ...page,
        avgPageLoadMs: roundMetric(page.avgPageLoadMs),
        avgRouteRenderMs: roundMetric(page.avgRouteRenderMs)
      })),
      recentVisits
    });
  } catch (error) {
    console.error('Admin traffic analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  trackAnalyticsEvent,
  getAdminTraffic
};
