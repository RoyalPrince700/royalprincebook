import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import AdminLayout from './AdminLayout';
import PageLoader from '../PageLoader';
import { formatDateTime, formatDuration, formatNumber } from './adminUtils';

const chartPalette = ['#0f172a', '#2563eb', '#7c3aed', '#f97316', '#06b6d4', '#10b981'];

const deviceLabel = (value) => {
  if (!value) return 'Unknown';
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const AdminTraffic = () => {
  const [traffic, setTraffic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTraffic = async () => {
      try {
        const response = await axios.get('/analytics/traffic');
        setTraffic(response.data);
      } catch (fetchError) {
        console.error('Failed to load admin traffic analytics:', fetchError);
        setError('Failed to load traffic analytics.');
      } finally {
        setLoading(false);
      }
    };

    fetchTraffic();
  }, []);

  const stats = traffic?.stats || {};
  const dailyTraffic = traffic?.dailyTraffic || [];
  const performanceTrend = traffic?.performanceTrend || [];
  const topPages = traffic?.topPages || [];
  const deviceBreakdown = useMemo(
    () =>
      (traffic?.deviceBreakdown || []).map((item) => ({
        ...item,
        name: deviceLabel(item.name)
      })),
    [traffic]
  );
  const slowPages = traffic?.slowPages || [];
  const recentVisits = traffic?.recentVisits || [];

  if (loading) {
    return (
      <PageLoader
        title="Loading traffic analytics"
        message="Pulling recent visitors, page trends, and performance timings."
      />
    );
  }

  return (
    <AdminLayout
      eyebrow="Admin Traffic"
      title="Watch visitors and site speed in one place."
      description="Follow traffic patterns, see which pages attract the most attention, and monitor the load signals that shape your visitors' experience."
      stats={[
        {
          label: 'Page Views',
          value: formatNumber(stats.totalPageViews || 0),
          helper: 'All tracked public-page views'
        },
        {
          label: 'Visitors',
          value: formatNumber(stats.uniqueVisitors || 0),
          helper: `${formatNumber(stats.activeVisitors7d || 0)} active in the last 7 days`
        },
        {
          label: 'Avg Load',
          value: formatDuration(stats.avgPageLoadMs),
          helper: `FCP ${formatDuration(stats.avgFirstContentfulPaintMs)}`
        },
        {
          label: 'Route Render',
          value: formatDuration(stats.avgRouteRenderMs),
          helper: `${formatNumber(stats.performanceSamples || 0)} performance samples`
        }
      ]}
    >
      {error ? (
        <div className="rounded-4xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <section className="rounded-4xl border border-white/70 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Traffic Trend
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              Visitors over the last 14 days
            </h2>
          </div>

          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyTraffic}>
                <defs>
                  <linearGradient id="pageviewsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.03} />
                  </linearGradient>
                  <linearGradient id="visitorsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f172a" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip formatter={(value) => formatNumber(value)} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="pageviews"
                  name="Page views"
                  stroke="#2563eb"
                  fill="url(#pageviewsFill)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="visitors"
                  name="Visitors"
                  stroke="#0f172a"
                  fill="url(#visitorsFill)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-4xl border border-white/70 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Devices
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              Visitor device split
            </h2>
          </div>

          <div className="mt-6 h-80">
            {deviceBreakdown.length === 0 ? (
              <div className="flex h-full items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-600">
                No device data yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceBreakdown}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={72}
                    outerRadius={110}
                    paddingAngle={3}
                  >
                    {deviceBreakdown.map((entry, index) => (
                      <Cell key={entry.name} fill={chartPalette[index % chartPalette.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatNumber(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <section className="rounded-4xl border border-white/70 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Performance
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              Load and render signals
            </h2>
          </div>

          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceTrend}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip formatter={(value) => formatDuration(Number(value))} />
                <Legend />
                <Line type="monotone" dataKey="avgPageLoadMs" name="Avg load" stroke="#2563eb" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="avgFirstContentfulPaintMs" name="Avg FCP" stroke="#7c3aed" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="avgRouteRenderMs" name="Avg route render" stroke="#0f172a" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-4xl border border-white/70 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Top Pages
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              Most visited routes
            </h2>
          </div>

          <div className="mt-6 h-80">
            {topPages.length === 0 ? (
              <div className="flex h-full items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-600">
                No page-view data yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topPages} layout="vertical" margin={{ left: 8, right: 8 }}>
                  <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" />
                  <XAxis type="number" tickLine={false} axisLine={false} allowDecimals={false} />
                  <YAxis
                    type="category"
                    dataKey="path"
                    tickLine={false}
                    axisLine={false}
                    width={120}
                  />
                  <Tooltip formatter={(value) => formatNumber(value)} />
                  <Bar dataKey="views" name="Views" fill="#0f172a" radius={[0, 12, 12, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <section className="rounded-4xl border border-white/70 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Page Health
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              Slower routes to watch
            </h2>
          </div>

          <div className="mt-6 space-y-3">
            {slowPages.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-sm text-slate-600">
                No performance samples yet.
              </div>
            ) : (
              slowPages.map((page) => (
                <div key={page.path} className="rounded-3xl border border-slate-200 bg-slate-50/90 px-5 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-950">{page.path}</p>
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      {formatNumber(page.samples || 0)} samples
                    </span>
                  </div>
                  <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                    <p>
                      Avg load: <span className="font-medium text-slate-900">{formatDuration(page.avgPageLoadMs)}</span>
                    </p>
                    <p>
                      Avg route render: <span className="font-medium text-slate-900">{formatDuration(page.avgRouteRenderMs)}</span>
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-4xl border border-white/70 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Recent Visits
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              Latest tracked sessions
            </h2>
          </div>

          <div className="mt-6 space-y-3">
            {recentVisits.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-sm text-slate-600">
                No recent visits yet.
              </div>
            ) : (
              recentVisits.map((visit) => (
                <div key={`${visit.path}-${visit.createdAt}`} className="rounded-3xl border border-slate-200 bg-slate-50/90 px-5 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-950">{visit.path}</p>
                    <p className="text-xs text-slate-500">{formatDateTime(visit.createdAt)}</p>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                      {deviceLabel(visit.deviceType)}
                    </span>
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                      {visit.browser || 'Unknown browser'}
                    </span>
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                      {visit.os || 'Unknown OS'}
                    </span>
                    {visit.referrerHost ? (
                      <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                        Referrer: {visit.referrerHost}
                      </span>
                    ) : null}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </AdminLayout>
  );
};

export default AdminTraffic;
