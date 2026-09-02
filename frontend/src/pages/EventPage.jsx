import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ContentPageShell from '../components/ContentPageShell';
import PageHero from '../components/PageHero';
import PageLoader from '../components/PageLoader';

const formatEventDate = (value, timezone = 'Africa/Lagos') => {
  if (!value) {
    return 'Date to be announced';
  }

  try {
    return new Intl.DateTimeFormat('en-NG', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZone: timezone,
      timeZoneName: 'short'
    }).format(new Date(value));
  } catch (_error) {
    return new Date(value).toLocaleString();
  }
};

const EventPage = () => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get('/events/workshop');
        setEvent(response.data.event || null);
        setError('');
      } catch (fetchError) {
        console.error('Failed to load workshop event:', fetchError);
        setError(
          fetchError.response?.data?.message ||
            'Unable to load the workshop event right now.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, []);

  if (loading) {
    return (
      <PageLoader
        title="Loading your workshop"
        message="Fetching the upcoming session schedule and live access details."
      />
    );
  }

  if (error || !event) {
    return (
      <ContentPageShell>
        <section className="pf-content-section" style={{ paddingTop: '2rem' }}>
          <div className="pf-container">
            <div className="pf-empty-state">
              <p className="pf-section-label">Workshop</p>
              <h1 className="pf-section-heading">{error || 'Event not found'}</h1>
              <div className="pf-cta-panel-actions" style={{ justifyContent: 'center', marginTop: '1.5rem' }}>
                <Link to="/all-books" className="pf-btn pf-btn-primary pf-btn-sm">
                  Browse Books
                </Link>
              </div>
            </div>
          </div>
        </section>
      </ContentPageShell>
    );
  }

  const sessions = Array.isArray(event.sessions) ? event.sessions : [];

  return (
    <ContentPageShell>
      <PageHero eyebrow="Premium Workshop" title={event.title}>
        <p className="pf-page-hero-copy" style={{ maxWidth: '48rem' }}>
          {event.description ||
            'Your live workshop schedule is below. Join links appear here on the day of each session.'}
        </p>
        <div className="pf-stat-grid" style={{ marginTop: '2rem' }}>
          <div className="pf-stat-card">
            <p className="pf-stat-label">Access</p>
            <p className="pf-stat-text">Unlocked with your book purchase</p>
          </div>
          <div className="pf-stat-card">
            <p className="pf-stat-label">Sessions</p>
            <p className="pf-stat-value">{sessions.length}</p>
          </div>
          <div className="pf-stat-card">
            <p className="pf-stat-label">Timezone</p>
            <p className="pf-stat-text">{event.timezone || 'Africa/Lagos'}</p>
          </div>
        </div>
      </PageHero>

      <section className="pf-content-section">
        <div className="pf-container pf-detail-grid">
          {sessions.map((session) => {
            const hasJoinLink = Boolean(session.joinUrl);
            return (
              <article key={session.sessionId} className="pf-panel pf-event-session-card">
                <p className="pf-section-label">Upcoming session</p>
                <h2 className="pf-section-heading">{session.title}</h2>
                <p className="pf-page-hero-copy" style={{ maxWidth: 'none' }}>
                  {session.description}
                </p>

                <div className="pf-mini-stat-grid">
                  <div className="pf-mini-stat">
                    <p className="pf-stat-label">Date & time</p>
                    <p className="pf-stat-value" style={{ fontSize: '1rem' }}>
                      {formatEventDate(session.startsAt, event.timezone)}
                    </p>
                  </div>
                </div>

                <div className="pf-cta-panel-actions" style={{ marginTop: '1.5rem' }}>
                  {hasJoinLink ? (
                    <a
                      href={session.joinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="pf-btn pf-btn-primary"
                    >
                      Join Live Session
                    </a>
                  ) : (
                    <span className="pf-tag-gold-soft">
                      Join link will appear here on the day of the event
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </ContentPageShell>
  );
};

export default EventPage;
