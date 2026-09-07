import React, { useEffect, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import ContentPageShell from '../components/ContentPageShell';
import PageHero from '../components/PageHero';
import PageLoader from '../components/PageLoader';
import WhatsAppIcon from '../components/WhatsAppIcon';
import { useAuth } from '../contexts/AuthContext';
import { getBookDetailsPath, userOwnsBuildWithAi } from '../utils/bookAccess';
import { getBookCover } from '../utils/bookUtils';
import {
  BUILD_WITH_AI_LOCAL_ID,
  BUILD_WITH_AI_READ_PATH,
  WORKSHOP_RECORDINGS_DRIVE_URL,
  WORKSHOP_WHATSAPP_GROUP_URL
} from '../utils/workshop';

const ResourceIcon = ({ name }) => {
  const paths = {
    event:
      'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    book: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
  };

  return (
    <svg className="pf-success-card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d={paths[name]} />
    </svg>
  );
};

const DriveIcon = () => (
  <svg className="pf-success-card-icon" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="currentColor" d="M7.71 3.5 1.5 14.25 4.29 19h6.42L7.71 3.5zm8.58 0-3.21 5.56 6.21 10.94H22.5L16.29 3.5zM8.79 14.25 12 8.69l3.21 5.56H8.79z" />
  </svg>
);

const PurchaseSuccessPage = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();
  const [recordingsUrl, setRecordingsUrl] = useState(WORKSHOP_RECORDINGS_DRIVE_URL);
  const justPurchased = Boolean(location.state?.purchaseConfirmed);
  const firstName = String(user?.username || 'builder').split(' ')[0];
  const bookCover = getBookCover('Build with AI');
  const bookDetailsPath = getBookDetailsPath({
    _id: BUILD_WITH_AI_LOCAL_ID,
    title: 'Build with AI'
  });

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const response = await axios.get('/events/workshop');
        const liveUrl = String(response.data?.event?.recordingsUrl || '').trim();
        if (liveUrl) {
          setRecordingsUrl(liveUrl);
        }
      } catch (_error) {
        setRecordingsUrl(WORKSHOP_RECORDINGS_DRIVE_URL);
      }
    };

    if (isAuthenticated && (justPurchased || userOwnsBuildWithAi(user))) {
      fetchRecordings();
    }
  }, [isAuthenticated, justPurchased, user]);

  if (loading) {
    return (
      <PageLoader
        title="Opening your workshop kit"
        message="Payment is confirmed. Getting your WhatsApp, event, recordings, and book links ready."
      />
    );
  }

  if (!isAuthenticated || (!justPurchased && !userOwnsBuildWithAi(user))) {
    return <Navigate to={bookDetailsPath} replace />;
  }

  const resources = [
    {
      key: 'whatsapp',
      eyebrow: 'Step 1',
      title: 'Join the WhatsApp group',
      copy: 'Meet the other builders, get session reminders, and ask questions as you go.',
      href: WORKSHOP_WHATSAPP_GROUP_URL,
      external: true,
      action: 'Open WhatsApp group',
      variant: 'whatsapp',
      icon: 'whatsapp'
    },
    {
      key: 'event',
      eyebrow: 'Step 2',
      title: 'Open the event page',
      copy: 'See the workshop schedule and grab the live join link when each session starts.',
      to: '/event',
      action: 'View event schedule',
      variant: 'primary',
      icon: 'event'
    },
    {
      key: 'recordings',
      eyebrow: 'Step 3',
      title: 'Watch the recorded sessions',
      copy: 'Missed a night or want to replay a build? The recordings live in this Google Drive folder.',
      href: recordingsUrl,
      external: true,
      action: 'Open Google Drive',
      variant: 'drive',
      icon: 'drive'
    },
    {
      key: 'book',
      eyebrow: 'Step 4',
      title: 'Start reading the book',
      copy: 'Fourteen practical chapters on the MERN stack and Cursor — your map after the live sessions.',
      to: BUILD_WITH_AI_READ_PATH,
      action: 'Start Chapter 1',
      variant: 'secondary',
      icon: 'book'
    }
  ];

  return (
    <ContentPageShell className="pf-success-page">
      <div className="pf-success-confetti" aria-hidden="true">
        {Array.from({ length: 18 }).map((_, index) => (
          <span key={index} className={`pf-success-confetti-piece pf-success-confetti-piece-${index + 1}`} />
        ))}
      </div>

      <PageHero centered eyebrow="Payment confirmed" title={`You are in, ${firstName}.`}>
        <p className="pf-page-hero-copy pf-success-hero-copy">
          Welcome to Build with AI. Your seat is unlocked. Tap the four doors below — group, live event,
          recordings, and the book — and start building today.
        </p>

        <div className="pf-success-seal" aria-hidden="true">
          <span className="pf-success-seal-check">✓</span>
          <span className="pf-success-seal-ring" />
        </div>

        <div className="pf-success-hero-meta">
          <img src={bookCover} alt="Build with AI book cover" className="pf-success-cover" />
          <div className="pf-success-hero-meta-copy">
            <p className="pf-section-label">Your new kit</p>
            <h2 className="pf-success-kit-title">Build with AI</h2>
            <p className="pf-success-kit-text">
              Workshop group, live sessions, recordings, and the full book — all yours now.
            </p>
          </div>
        </div>
      </PageHero>

      <section className="pf-content-section">
        <div className="pf-container">
          <div className="pf-success-grid">
            {resources.map((resource) => {
              const actionClass = `pf-btn pf-btn-sm ${
                resource.variant === 'whatsapp'
                  ? 'pf-btn-whatsapp'
                  : resource.variant === 'drive'
                    ? 'pf-btn-drive'
                    : resource.variant === 'primary'
                      ? 'pf-btn-primary'
                      : 'pf-btn-secondary'
              }`;

              return (
                <article key={resource.key} className={`pf-success-card pf-success-card-${resource.key}`}>
                  <p className="pf-section-label">{resource.eyebrow}</p>
                  <div className="pf-success-card-icon-wrap" aria-hidden="true">
                    {resource.icon === 'whatsapp' ? (
                      <WhatsAppIcon className="pf-success-card-icon pf-whatsapp-icon" />
                    ) : resource.icon === 'drive' ? (
                      <DriveIcon />
                    ) : (
                      <ResourceIcon name={resource.icon} />
                    )}
                  </div>
                  <h2 className="pf-success-card-title">{resource.title}</h2>
                  <p className="pf-success-card-copy">{resource.copy}</p>
                  {resource.external ? (
                    <a
                      href={resource.href}
                      target="_blank"
                      rel="noreferrer"
                      className={actionClass}
                    >
                      {resource.icon === 'whatsapp' ? <WhatsAppIcon /> : null}
                      {resource.action}
                    </a>
                  ) : (
                    <Link to={resource.to} className={actionClass}>
                      {resource.action}
                    </Link>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </ContentPageShell>
  );
};

export default PurchaseSuccessPage;
