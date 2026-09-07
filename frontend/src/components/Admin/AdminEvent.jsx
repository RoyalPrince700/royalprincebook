import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from './AdminLayout';
import PageLoader from '../PageLoader';
import { usePlatformDialog } from '../../contexts/PlatformDialogContext';

const toLocalInputValue = (value) => {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
};

const AdminEvent = () => {
  const { notify } = usePlatformDialog();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get('/admin/events/workshop');
        setEvent(response.data.event || null);
        setError('');
      } catch (fetchError) {
        console.error('Failed to load workshop event:', fetchError);
        setError('Failed to load workshop event settings.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, []);

  const updateSession = (sessionId, field, value) => {
    setEvent((prev) => ({
      ...prev,
      sessions: (prev?.sessions || []).map((session) =>
        session.sessionId === sessionId ? { ...session, [field]: value } : session
      )
    }));
  };

  const handleSave = async (formEvent) => {
    formEvent.preventDefault();
    setSaving(true);

    try {
      const response = await axios.put('/admin/events/workshop', {
        title: event.title,
        description: event.description,
        timezone: event.timezone,
        recordingsUrl: event.recordingsUrl,
        sessions: event.sessions
      });

      setEvent(response.data.event || event);
      notify({
        title: 'Event updated',
        message: 'Workshop schedule and join links were saved.',
        variant: 'success'
      });
    } catch (saveError) {
      console.error('Failed to update workshop event:', saveError);
      notify({
        title: 'Save failed',
        message: 'Could not update the workshop event. Please try again.',
        variant: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageLoader
        title="Loading event settings"
        message="Fetching the workshop schedule and join link fields."
      />
    );
  }

  return (
    <AdminLayout
      hero="split"
      eyebrow="Workshop Event"
      title="Manage the live workshop page."
      description="Set the schedule now. On the day of each session, paste the live link and premium readers will be able to join."
      stats={[
        {
          label: 'Sessions',
          value: event?.sessions?.length || 0,
          helper: 'Scheduled live workshop days'
        },
        {
          label: 'Access',
          value: 'Premium',
          helper: 'Visible to paid book buyers'
        },
        {
          label: 'Public page',
          value: '/event',
          helper: 'Readers see this after purchase'
        }
      ]}
    >
      {error ? (
        <div className="rounded-4xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
          <label className="mb-2 block text-sm font-medium text-slate-700">Event title</label>
          <input
            type="text"
            value={event?.title || ''}
            onChange={(e) => setEvent((prev) => ({ ...prev, title: e.target.value }))}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
          />

          <label className="mb-2 mt-5 block text-sm font-medium text-slate-700">Description</label>
          <textarea
            rows="4"
            value={event?.description || ''}
            onChange={(e) => setEvent((prev) => ({ ...prev, description: e.target.value }))}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
          />

          <label className="mb-2 mt-5 block text-sm font-medium text-slate-700">Timezone</label>
          <input
            type="text"
            value={event?.timezone || 'Africa/Lagos'}
            onChange={(e) => setEvent((prev) => ({ ...prev, timezone: e.target.value }))}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
          />

          <label className="mb-2 mt-5 block text-sm font-medium text-slate-700">
            Recordings (Google Drive)
          </label>
          <input
            type="url"
            value={event?.recordingsUrl || ''}
            onChange={(e) => setEvent((prev) => ({ ...prev, recordingsUrl: e.target.value }))}
            placeholder="https://drive.google.com/drive/folders/..."
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
          />
        </div>

        {(event?.sessions || []).map((session) => (
          <div
            key={session.sessionId}
            className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              {session.sessionId}
            </p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900">{session.title}</h3>

            <label className="mb-2 mt-5 block text-sm font-medium text-slate-700">Session title</label>
            <input
              type="text"
              value={session.title || ''}
              onChange={(e) => updateSession(session.sessionId, 'title', e.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            />

            <label className="mb-2 mt-5 block text-sm font-medium text-slate-700">Description</label>
            <textarea
              rows="3"
              value={session.description || ''}
              onChange={(e) => updateSession(session.sessionId, 'description', e.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            />

            <label className="mb-2 mt-5 block text-sm font-medium text-slate-700">Starts at</label>
            <input
              type="datetime-local"
              value={toLocalInputValue(session.startsAt)}
              onChange={(e) =>
                updateSession(
                  session.sessionId,
                  'startsAt',
                  e.target.value ? new Date(e.target.value).toISOString() : session.startsAt
                )
              }
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            />

            <label className="mb-2 mt-5 block text-sm font-medium text-slate-700">
              Join link (add on event day)
            </label>
            <input
              type="url"
              value={session.joinUrl || ''}
              onChange={(e) => updateSession(session.sessionId, 'joinUrl', e.target.value)}
              placeholder="https://meet.google.com/..."
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={saving}
          className="pf-btn pf-btn-primary pf-btn-sm disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save Event Settings'}
        </button>
      </form>
    </AdminLayout>
  );
};

export default AdminEvent;
