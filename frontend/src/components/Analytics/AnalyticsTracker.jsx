import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const analyticsEndpoint = `${apiBaseUrl}/analytics/track`;
const visitorStorageKey = 'analytics-visitor-id';
const sessionStorageKey = 'analytics-session-id';
const recentRouteHits = new Map();
const recentRouteWindowMs = 1500;
let hasReportedInitialLoad = false;

const createId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const getStorageId = (storage, key) => {
  const existingId = storage.getItem(key);

  if (existingId) {
    return existingId;
  }

  const nextId = createId();
  storage.setItem(key, nextId);
  return nextId;
};

const shouldTrackPath = (pathname) => {
  const excludedPrefixes = ['/admin', '/dashboard', '/login', '/register', '/auth'];
  return !excludedPrefixes.some((prefix) => pathname.startsWith(prefix));
};

const sendAnalyticsEvent = async (payload) => {
  const body = JSON.stringify(payload);

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' });
      navigator.sendBeacon(analyticsEndpoint, blob);
      return;
    }

    await fetch(analyticsEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body,
      keepalive: true
    });
  } catch (_error) {
    // Analytics should never block the user journey.
  }
};

const readPerformanceMetrics = () => {
  const navigationEntry = performance.getEntriesByType('navigation')[0];
  const paintEntries = performance.getEntriesByType('paint');
  const firstContentfulPaint = paintEntries.find((entry) => entry.name === 'first-contentful-paint');

  return {
    pageLoadMs: navigationEntry?.loadEventEnd || undefined,
    domContentLoadedMs: navigationEntry?.domContentLoadedEventEnd || undefined,
    firstContentfulPaintMs: firstContentfulPaint?.startTime || undefined
  };
};

const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === 'undefined' || !shouldTrackPath(location.pathname)) {
      return undefined;
    }

    const routeKey = `${location.pathname}${location.search}`;
    const now = Date.now();
    const lastTrackedAt = recentRouteHits.get(routeKey);

    if (lastTrackedAt && now - lastTrackedAt < recentRouteWindowMs) {
      return undefined;
    }

    recentRouteHits.set(routeKey, now);

    const visitorId = getStorageId(window.localStorage, visitorStorageKey);
    const sessionId = getStorageId(window.sessionStorage, sessionStorageKey);
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    sendAnalyticsEvent({
      type: 'pageview',
      path: location.pathname,
      title: document.title,
      referrer: document.referrer,
      visitorId,
      sessionId,
      viewport,
      connectionType: navigator.connection?.effectiveType
    });

    const routeStart = performance.now();
    const timerId = window.setTimeout(() => {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          const metrics = hasReportedInitialLoad ? {} : readPerformanceMetrics();
          hasReportedInitialLoad = true;

          sendAnalyticsEvent({
            type: 'performance',
            path: location.pathname,
            title: document.title,
            referrer: document.referrer,
            visitorId,
            sessionId,
            viewport,
            connectionType: navigator.connection?.effectiveType,
            metrics: {
              ...metrics,
              routeRenderMs: performance.now() - routeStart
            }
          });
        });
      });
    }, 900);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [location.pathname, location.search]);

  return null;
};

export default AnalyticsTracker;
