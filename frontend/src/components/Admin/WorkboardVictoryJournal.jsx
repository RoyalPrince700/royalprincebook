import React, { useEffect, useMemo, useState } from 'react';
import { calculateDayPlanningStats, calculateRoyalScore } from '../../utils/workboardGamification';

const formatVictoryDate = (dateKey) => {
  if (!dateKey) return '';
  const [year, month, day] = String(dateKey).split('-').map(Number);
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(year, month - 1, day));
};

/**
 * Reflective end-of-day wins — not a notes app.
 */
const WorkboardVictoryJournal = ({
  todayKey,
  statsTasks = [],
  currentStreak = 0,
  victories = [],
  canEdit = false,
  loading = false,
  error = '',
  saving = false,
  onSave,
  onDelete,
  onRetry,
  onBack
}) => {
  const todayStats = useMemo(
    () => calculateDayPlanningStats(todayKey, statsTasks),
    [todayKey, statsTasks]
  );
  const todayXp = useMemo(
    () =>
      todayStats.completedOnDayTasks.reduce((sum, task) => {
        const awarded = Number(task?.xpAwarded);
        return sum + (Number.isFinite(awarded) && awarded > 0 ? awarded : 0);
      }, 0),
    [todayStats]
  );
  const royalScore = useMemo(
    () =>
      calculateRoyalScore({
        tasks: statsTasks,
        currentStreak,
        todayKey
      }).score,
    [statsTasks, currentStreak, todayKey]
  );

  const todayEntry = useMemo(
    () => victories.find((entry) => entry.date === todayKey) || null,
    [victories, todayKey]
  );

  const [draft, setDraft] = useState(todayEntry?.winText || '');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    setDraft(todayEntry?.winText || '');
  }, [todayEntry?.winText, todayKey]);

  const history = useMemo(
    () => [...victories].sort((a, b) => String(b.date).localeCompare(String(a.date))),
    [victories]
  );

  const handleSave = async (event) => {
    event.preventDefault();
    if (!canEdit || saving) return;
    const winText = draft.trim();
    if (!winText) {
      setLocalError('Capture one win before saving.');
      return;
    }
    setLocalError('');
    await onSave?.({
      date: todayKey,
      winText,
      tasksCompleted: todayStats.completedOnDay,
      xpEarned: todayXp,
      royalScore
    });
  };

  if (loading) {
    return (
      <div className="wb-victory" aria-busy="true">
        <header className="wb-victory-head">
          <div>
            <p className="wb-game-kicker">Victory Journal</p>
            <h1 className="wb-victory-title">What did you win today?</h1>
          </div>
          <button type="button" className="wb-mode-btn is-active" onClick={onBack}>
            Back to board
          </button>
        </header>
        <div className="wb-skeleton-stack">
          <div className="wb-skeleton-block is-tall" />
          <div className="wb-skeleton-block" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wb-victory">
        <header className="wb-victory-head">
          <div>
            <p className="wb-game-kicker">Victory Journal</p>
            <h1 className="wb-victory-title">What did you win today?</h1>
          </div>
          <button type="button" className="wb-mode-btn is-active" onClick={onBack}>
            Back to board
          </button>
        </header>
        <div className="wb-state-panel" role="alert">
          <p className="wb-state-title">Journal unavailable</p>
          <p className="wb-state-copy">{error}</p>
          {onRetry ? (
            <button type="button" className="wb-today-btn" onClick={onRetry}>
              Retry
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="wb-victory">
      <header className="wb-victory-head">
        <div>
          <p className="wb-game-kicker">Victory Journal</p>
          <h1 className="wb-victory-title">What did you win today?</h1>
          <p className="wb-victory-date">{formatVictoryDate(todayKey)}</p>
        </div>
        <button type="button" className="wb-mode-btn is-active" onClick={onBack}>
          Back to board
        </button>
      </header>

      <section className="wb-victory-today" aria-labelledby="wb-victory-today-title">
        <p className="wb-game-kicker" id="wb-victory-today-title">
          Win of the day
        </p>

        {canEdit ? (
          <form className="wb-victory-form" onSubmit={handleSave}>
            <label className="wb-modal-label" htmlFor="wb-victory-input">
              Today&apos;s win
            </label>
            <textarea
              id="wb-victory-input"
              className="wb-victory-input"
              rows={3}
              maxLength={500}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="e.g. Finished the main deliverable on time."
            />
            {localError ? (
              <p className="wb-report-error" role="alert">
                {localError}
              </p>
            ) : null}
            <div className="wb-victory-snapshot" aria-label="Today snapshot">
              <span>
                Tasks completed <strong>{todayStats.completedOnDay}</strong>
              </span>
              <span>
                XP <strong>{todayXp}</strong>
              </span>
              <span>
                Royal Score <strong>{royalScore}</strong>
              </span>
            </div>
            <button type="submit" className="wb-today-btn" disabled={saving}>
              {saving ? 'Saving…' : todayEntry ? 'Update win' : 'Save win'}
            </button>
          </form>
        ) : todayEntry ? (
          <article className="wb-victory-card is-today">
            <p className="wb-victory-win">{todayEntry.winText}</p>
            <div className="wb-victory-snapshot">
              <span>
                Tasks completed <strong>{todayEntry.tasksCompleted}</strong>
              </span>
              <span>
                XP <strong>{todayEntry.xpEarned}</strong>
              </span>
              <span>
                Royal Score <strong>{todayEntry.royalScore}</strong>
              </span>
            </div>
          </article>
        ) : (
          <div className="wb-state-panel is-compact">
            <p className="wb-state-title">No win captured yet.</p>
            <p className="wb-state-copy">Only the board owner can write today&apos;s victory.</p>
          </div>
        )}
      </section>

      <section className="wb-victory-history" aria-labelledby="wb-victory-history-title">
        <h2 id="wb-victory-history-title" className="wb-analytics-section-title">
          Past victories
        </h2>
        {history.length === 0 ? (
          <div className="wb-state-panel is-compact">
            <p className="wb-state-title">Your first win is waiting.</p>
            <p className="wb-state-copy">Close the day with one sentence of proof.</p>
          </div>
        ) : (
          <ul className="wb-victory-list">
            {history.map((entry) => (
              <li key={entry._id || entry.date}>
                <article className="wb-victory-card">
                  <p className="wb-victory-card-date">{formatVictoryDate(entry.date)}</p>
                  <p className="wb-victory-win">{entry.winText}</p>
                  <div className="wb-victory-snapshot">
                    <span>
                      Tasks <strong>{entry.tasksCompleted}</strong>
                    </span>
                    <span>
                      XP <strong>{entry.xpEarned}</strong>
                    </span>
                    <span>
                      Royal <strong>{entry.royalScore}</strong>
                    </span>
                  </div>
                  {canEdit && onDelete ? (
                    <button
                      type="button"
                      className="wb-victory-delete"
                      onClick={() => onDelete(entry)}
                      aria-label={`Delete victory for ${entry.date}`}
                    >
                      Remove
                    </button>
                  ) : null}
                </article>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default WorkboardVictoryJournal;
