import React, { useEffect, useRef, useState } from 'react';
import { formatFocusClock } from '../../utils/workboardGamification';

/** Persist active focus roughly every 45s without writing every tick. */
const FOCUS_AUTOSAVE_MS = 45000;

/**
 * Distraction-free focus timer for a single task.
 * Persists elapsed seconds via onSaveFocus(seconds):
 * - every ~45s while running
 * - on pause / complete / exit
 * - when the tab becomes hidden
 */
const WorkboardFocusMode = ({
  task,
  onComplete,
  onExit,
  onSaveFocus
}) => {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);
  const [saving, setSaving] = useState(false);
  const sessionRef = useRef(0);
  const tickRef = useRef(null);
  const autosaveRef = useRef(null);
  const flushingRef = useRef(false);
  const onSaveFocusRef = useRef(onSaveFocus);

  useEffect(() => {
    onSaveFocusRef.current = onSaveFocus;
  }, [onSaveFocus]);

  const flushFocus = async ({ keepalive = false } = {}) => {
    const accrued = sessionRef.current;
    if (accrued <= 0 || !onSaveFocusRef.current) return 0;
    if (flushingRef.current) return 0;

    flushingRef.current = true;
    sessionRef.current = 0;
    setSaving(true);
    try {
      await onSaveFocusRef.current(accrued, { keepalive });
      return accrued;
    } catch (error) {
      // Restore unsaved seconds so a later flush can retry.
      sessionRef.current += accrued;
      throw error;
    } finally {
      flushingRef.current = false;
      setSaving(false);
    }
  };

  useEffect(() => {
    if (!running) {
      if (tickRef.current) {
        clearInterval(tickRef.current);
        tickRef.current = null;
      }
      if (autosaveRef.current) {
        clearInterval(autosaveRef.current);
        autosaveRef.current = null;
      }
      return undefined;
    }

    tickRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
      sessionRef.current += 1;
    }, 1000);

    autosaveRef.current = setInterval(() => {
      flushFocus().catch(() => {});
    }, FOCUS_AUTOSAVE_MS);

    return () => {
      if (tickRef.current) {
        clearInterval(tickRef.current);
        tickRef.current = null;
      }
      if (autosaveRef.current) {
        clearInterval(autosaveRef.current);
        autosaveRef.current = null;
      }
    };
  }, [running]);

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        flushFocus({ keepalive: true }).catch(() => {});
      }
    };

    const onPageHide = () => {
      flushFocus({ keepalive: true }).catch(() => {});
    };

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', onPageHide);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', onPageHide);
      // Best-effort flush if the overlay unmounts while time is pending.
      flushFocus({ keepalive: true }).catch(() => {});
    };
  }, []);

  const handlePause = async () => {
    setRunning(false);
    try {
      await flushFocus();
    } catch {
      // Keep UI usable even if autosave fails.
    }
  };

  const handleResume = () => {
    setRunning(true);
  };

  const handleExit = async () => {
    setRunning(false);
    try {
      await flushFocus();
    } catch {
      // Ignore — user is leaving focus mode.
    }
    onExit?.();
  };

  const handleComplete = async () => {
    setRunning(false);
    try {
      await flushFocus();
    } catch {
      // Still allow completion; focus seconds may retry via task reload state.
    }
    onComplete?.();
  };

  if (!task) return null;

  return (
    <div className="wb-focus-backdrop" role="dialog" aria-modal="true" aria-label="Focus mode">
      <div className="wb-focus-panel">
        <p className="wb-game-kicker">Focus Mode</p>
        <h2 className="wb-focus-title">{task.title}</h2>
        <p className="wb-focus-clock" aria-live="polite">
          {formatFocusClock(seconds)}
        </p>
        <p className="wb-focus-hint">
          {(Number(task.focusTime) || 0) > 0
            ? `Saved focus: ${formatFocusClock(task.focusTime)}`
            : 'Timer running — stay with this one thing.'}
        </p>

        <div className="wb-focus-actions">
          {running ? (
            <button type="button" className="wb-focus-btn" onClick={handlePause} disabled={saving}>
              Pause
            </button>
          ) : (
            <button type="button" className="wb-focus-btn" onClick={handleResume} disabled={saving}>
              Resume
            </button>
          )}
          <button
            type="button"
            className="wb-focus-btn is-primary"
            onClick={handleComplete}
            disabled={saving}
          >
            Complete
          </button>
          <button type="button" className="wb-focus-btn" onClick={handleExit} disabled={saving}>
            Exit
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkboardFocusMode;
