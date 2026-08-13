import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import PageLoader from '../PageLoader';
import { formatDateTime } from './adminUtils';

const STATUS_STYLES = {
  started: 'bg-sky-200/80 text-sky-900',
  in_progress: 'bg-amber-200/70 text-amber-900',
  almost_done: 'bg-orange-200/70 text-orange-900',
  completed: 'bg-emerald-200/70 text-emerald-900',
  postponed: 'bg-slate-200/80 text-slate-700'
};

const STATUS_LABELS = {
  started: 'Started',
  in_progress: 'In progress',
  almost_done: 'Almost done',
  completed: 'Completed',
  postponed: 'Postponed'
};

const formatTime12h = (hhmm) => {
  if (!hhmm || !/^\d{1,2}:\d{2}$/.test(hhmm)) return '';
  const [hourStr, minuteStr] = hhmm.split(':');
  let hour = Number(hourStr);
  const minutes = Number(minuteStr);
  if (Number.isNaN(hour) || Number.isNaN(minutes)) return '';
  const period = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  if (hour === 0) hour = 12;
  if (minutes === 0) return `${hour} ${period}`;
  return `${hour}:${String(minutes).padStart(2, '0')} ${period}`;
};

const AdminWorkboardShare = () => {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copyNote, setCopyNote] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const response = await axios.get(`/workboard/share/${token}`);
        setData(response.data);
      } catch (fetchError) {
        console.error('Failed to load shared workboard:', fetchError);
        setError(fetchError.response?.data?.message || 'Share link is unavailable.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token]);

  if (loading) {
    return (
      <PageLoader
        title="Loading shared Workboard"
        message="Opening the shared progress report."
      />
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-20 text-slate-900">
        <div className="mx-auto max-w-xl rounded-4xl border border-red-200 bg-red-50 px-6 py-8 text-center">
          <h1 className="text-2xl font-semibold text-red-800">Share unavailable</h1>
          <p className="mt-3 text-sm text-red-700">{error || 'Unknown error'}</p>
          <Link to="/login" className="mt-6 inline-block text-sm font-medium text-slate-800 underline">
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  const copyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(data.markdown || '');
      setCopyNote('Report copied.');
    } catch (_err) {
      setCopyNote('Select the report text to copy.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-3 py-10 text-slate-900 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-4xl space-y-5">
        <div className="rounded-4xl border border-white/70 bg-white/85 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
            Shared Workboard
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            {data.owner?.username || 'Worker'} · {data.period} report
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            {data.startDate} → {data.endDate}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                data.presence?.status === 'online'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  data.presence?.status === 'online' ? 'bg-emerald-500' : 'bg-slate-400'
                }`}
              />
              {data.presence?.status === 'online' ? 'Online' : 'Offline'}
              {data.presence?.lastSeen
                ? ` · last seen ${formatDateTime(data.presence.lastSeen)}`
                : ''}
            </span>
            <button
              type="button"
              onClick={copyMarkdown}
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800"
            >
              Copy markdown
            </button>
          </div>
          {copyNote ? <p className="mt-3 text-sm text-emerald-700">{copyNote}</p> : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {[
            ['Total', data.summary?.total],
            ['Started', data.summary?.started],
            ['In progress', data.summary?.in_progress],
            ['Almost done', data.summary?.almost_done],
            ['Completed', data.summary?.completed],
            ['Postponed', data.summary?.postponed]
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                {label}
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">{value || 0}</p>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          {(data.tasks || []).map((task) => (
            <article
              key={task._id}
              className="rounded-3xl border border-slate-200 bg-white/90 p-4 sm:p-5"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    STATUS_STYLES[task.status] || STATUS_STYLES.started
                  }`}
                >
                  {STATUS_LABELS[task.status] || task.status}
                </span>
                <span className="text-xs text-slate-500">{task.date}</span>
                {task.startTime ? (
                  <span className="text-xs text-slate-500">
                    {formatTime12h(task.startTime)}
                    {task.endTime ? ` – ${formatTime12h(task.endTime)}` : ''}
                  </span>
                ) : null}
              </div>
              <h2 className="mt-2 text-lg font-semibold text-slate-950">{task.title}</h2>
              {task.description ? (
                <p className="mt-2 text-sm text-slate-600">{task.description}</p>
              ) : null}
              {(task.comments || []).length > 0 ? (
                <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
                  {task.comments.slice(-3).map((comment) => (
                    <p key={comment._id} className="text-sm text-slate-600">
                      <span className="font-medium text-slate-800">{comment.authorName}:</span>{' '}
                      {comment.body}
                    </p>
                  ))}
                </div>
              ) : null}
            </article>
          ))}
        </div>

        <pre className="overflow-auto rounded-3xl border border-slate-200 bg-white p-4 text-xs leading-relaxed text-slate-700 sm:p-5">
          {data.markdown}
        </pre>
      </div>
    </div>
  );
};

export default AdminWorkboardShare;
