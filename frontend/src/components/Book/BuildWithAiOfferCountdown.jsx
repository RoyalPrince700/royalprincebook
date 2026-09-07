import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBookDetailsPath } from '../../utils/bookAccess';
import { CATALOG_BOOK_SLUGS } from '../../utils/bookSlugs';

const STORAGE_KEY = 'rph-build-with-ai-offer-deadline';
const OFFER_DURATION_MS = 12 * 60 * 60 * 1000;
const FUTURE_PRICE = 5000;

const buildWithAiDetailsPath = getBookDetailsPath({
  _id: 'local-build-with-ai',
  title: 'Build with AI'
});

const pad = (value) => String(value).padStart(2, '0');

const getRemainingParts = (deadlineMs) => {
  const remainingMs = Math.max(0, deadlineMs - Date.now());
  const totalSeconds = Math.floor(remainingMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    remainingMs,
    hours,
    minutes,
    seconds,
    expired: remainingMs <= 0
  };
};

const resolveDeadline = () => {
  try {
    const stored = Number(localStorage.getItem(STORAGE_KEY));
    if (Number.isFinite(stored) && stored > Date.now()) {
      return stored;
    }

    const nextDeadline = Date.now() + OFFER_DURATION_MS;
    localStorage.setItem(STORAGE_KEY, String(nextDeadline));
    return nextDeadline;
  } catch (_error) {
    return Date.now() + OFFER_DURATION_MS;
  }
};

const BuildWithAiOfferCountdown = () => {
  const [deadline] = useState(resolveDeadline);
  const [timeLeft, setTimeLeft] = useState(() => getRemainingParts(deadline));

  useEffect(() => {
    setTimeLeft(getRemainingParts(deadline));

    const timerId = window.setInterval(() => {
      setTimeLeft(getRemainingParts(deadline));
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [deadline]);

  return (
    <div className="pf-offer-countdown" data-book-slug={CATALOG_BOOK_SLUGS.BUILD_WITH_AI}>
      <div className="pf-offer-countdown-copy">
        <p className="pf-offer-countdown-eyebrow">Limited launch price</p>
        <h2 className="pf-offer-countdown-title">
          Build with AI rises to NGN {FUTURE_PRICE.toLocaleString()} soon
        </h2>
        <p className="pf-offer-countdown-text">
          {timeLeft.expired
            ? 'The launch window is closing. Lock in the current price before it moves to NGN 5,000.'
            : 'Grab it at the current launch price before this 12-hour window ends and the price becomes NGN 5,000.'}
        </p>
        <Link to={buildWithAiDetailsPath} className="pf-btn pf-btn-primary pf-btn-sm">
          Get Build with AI now
        </Link>
      </div>

      <div className="pf-offer-countdown-timer" aria-live="polite">
        <p className="pf-offer-countdown-timer-label">
          {timeLeft.expired ? 'Offer ending' : 'Price increase in'}
        </p>
        <div className="pf-offer-countdown-digits">
          <div className="pf-offer-countdown-unit">
            <span className="pf-offer-countdown-value">{pad(timeLeft.hours)}</span>
            <span className="pf-offer-countdown-unit-label">Hours</span>
          </div>
          <span className="pf-offer-countdown-sep" aria-hidden="true">
            :
          </span>
          <div className="pf-offer-countdown-unit">
            <span className="pf-offer-countdown-value">{pad(timeLeft.minutes)}</span>
            <span className="pf-offer-countdown-unit-label">Mins</span>
          </div>
          <span className="pf-offer-countdown-sep" aria-hidden="true">
            :
          </span>
          <div className="pf-offer-countdown-unit">
            <span className="pf-offer-countdown-value">{pad(timeLeft.seconds)}</span>
            <span className="pf-offer-countdown-unit-label">Secs</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildWithAiOfferCountdown;
