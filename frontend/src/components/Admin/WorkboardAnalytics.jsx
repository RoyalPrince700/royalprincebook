import React, { useMemo, useState } from 'react';
import {
  analyzeRollovers,
  buildProductivityAnalytics,
  calculatePlanningWeeklyStats,
  calculateProductivityTrends,
  formatDurationHours,
  generateProductivityInsights
} from '../../utils/workboardGamification';

const StatCell = ({ label, value, hint }) => (
  <div className="wb-analytics-stat">
    <p className="wb-game-kicker">{label}</p>
    <p className="wb-analytics-stat-value">{value}</p>
    {hint ? <p className="wb-analytics-stat-hint">{hint}</p> : null}
  </div>
);

const TrendRow = ({ label, current, previous, delta, suffix = '' }) => {
  const hasPrev = previous != null;
  const up = typeof delta === 'number' && delta > 0;
  const down = typeof delta === 'number' && delta < 0;
  return (
    <div className="wb-analytics-trend-row">
      <p className="wb-analytics-trend-label">{label}</p>
      <div className="wb-analytics-trend-values">
        <span>
          This week: <strong>{current}{suffix}</strong>
        </span>
        {hasPrev ? (
          <span>
            Last week: <strong>{previous}{suffix}</strong>
          </span>
        ) : (
          <span className="wb-analytics-muted">Last week: more data needed</span>
        )}
        {hasPrev && delta != null ? (
          <span className={`wb-analytics-delta${up ? ' is-up' : ''}${down ? ' is-down' : ''}`}>
            {delta > 0 ? '↑' : delta < 0 ? '↓' : '→'} {delta > 0 ? '+' : ''}
            {delta}
            {suffix}
          </span>
        ) : null}
      </div>
    </div>
  );
};

/**
 * Productivity analytics — numbers from calculateDayPlanningStats + gamification helpers.
 */
const WorkboardAnalytics = ({
  todayKey,
  weekStart,
  weekIndex = 0,
  statsTasks = [],
  totalXp = 0,
  royalScore = 0,
  currentStreak = 0,
  longestStreak = 0,
  loading = false,
  error = '',
  onRetry,
  onBack,
  onGoVictories
}) => {
  const [weekOffset, setWeekOffset] = useState(0);

  const activeWeekStart = useMemo(() => {
    if (!weekStart) return todayKey;
    const [y, m, d] = String(weekStart).split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + weekOffset * 7);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, [weekStart, weekOffset, todayKey]);

  const analytics = useMemo(
    () =>
      buildProductivityAnalytics({
        tasks: statsTasks,
        todayKey,
        totalXp,
        currentStreak,
        longestStreak
      }),
    [statsTasks, todayKey, totalXp, currentStreak, longestStreak]
  );

  const weekly = useMemo(
    () => calculatePlanningWeeklyStats(activeWeekStart, statsTasks, weekIndex + weekOffset),
    [activeWeekStart, statsTasks, weekIndex, weekOffset]
  );

  const trends = useMemo(
    () => calculateProductivityTrends(statsTasks, todayKey, weekStart),
    [statsTasks, todayKey, weekStart]
  );

  const rollovers = useMemo(
    () => analyzeRollovers(statsTasks, { weekStart: activeWeekStart }),
    [statsTasks, activeWeekStart]
  );

  const insightPack = useMemo(
    () =>
      generateProductivityInsights({
        tasks: statsTasks,
        todayKey,
        weekStart,
        analytics,
        trends,
        rollovers
      }),
    [statsTasks, todayKey, weekStart, analytics, trends, rollovers]
  );

  const maxDayCompletions = Math.max(
    1,
    ...weekly.days.map((day) => Math.max(day.completedOnDay, day.planned))
  );

  if (loading) {
    return (
      <div className="wb-analytics" aria-busy="true">
        <header className="wb-analytics-head">
          <div>
            <p className="wb-game-kicker">Analytics</p>
            <h1 className="wb-analytics-title">Execution Intelligence</h1>
          </div>
          <button type="button" className="wb-mode-btn is-active" onClick={onBack}>
            Back to board
          </button>
        </header>
        <div className="wb-skeleton-stack" aria-label="Loading analytics">
          <div className="wb-skeleton-block" />
          <div className="wb-skeleton-block is-wide" />
          <div className="wb-skeleton-grid">
            <div className="wb-skeleton-block" />
            <div className="wb-skeleton-block" />
            <div className="wb-skeleton-block" />
            <div className="wb-skeleton-block" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wb-analytics">
        <header className="wb-analytics-head">
          <div>
            <p className="wb-game-kicker">Analytics</p>
            <h1 className="wb-analytics-title">Execution Intelligence</h1>
          </div>
          <button type="button" className="wb-mode-btn is-active" onClick={onBack}>
            Back to board
          </button>
        </header>
        <div className="wb-state-panel" role="alert">
          <p className="wb-state-title">Couldn&apos;t load analytics</p>
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

  if (!analytics.hasData) {
    return (
      <div className="wb-analytics">
        <header className="wb-analytics-head">
          <div>
            <p className="wb-game-kicker">Analytics</p>
            <h1 className="wb-analytics-title">Execution Intelligence</h1>
          </div>
          <button type="button" className="wb-mode-btn is-active" onClick={onBack}>
            Back to board
          </button>
        </header>
        <div className="wb-state-panel">
          <p className="wb-state-title">Keep executing.</p>
          <p className="wb-state-copy">Your productivity patterns will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="wb-analytics">
      <header className="wb-analytics-head">
        <div>
          <p className="wb-game-kicker">Analytics</p>
          <h1 className="wb-analytics-title">Execution Intelligence</h1>
          <p className="wb-analytics-sub">Plan → Execute → Measure → Improve</p>
        </div>
        <div className="wb-analytics-head-actions">
          {onGoVictories ? (
            <button type="button" className="wb-mode-btn" onClick={onGoVictories}>
              Victory Journal
            </button>
          ) : null}
          <button type="button" className="wb-mode-btn is-active" onClick={onBack}>
            Back to board
          </button>
        </div>
      </header>

      <section className="wb-analytics-section" aria-labelledby="wb-analytics-overview">
        <h2 id="wb-analytics-overview" className="wb-analytics-section-title">
          Productivity overview
        </h2>
        <div className="wb-analytics-stat-grid">
          <StatCell label="Planned" value={analytics.planned} />
          <StatCell label="Completed" value={analytics.completed} />
          <StatCell label="Completion" value={`${analytics.completionRate}%`} />
          <StatCell label="XP earned" value={analytics.xpEarned.toLocaleString()} />
          <StatCell label="Royal Score" value={royalScore || analytics.royalScore} />
          <StatCell
            label="Streak"
            value={analytics.currentStreak}
            hint={`Longest ${analytics.longestStreak}`}
          />
          <StatCell label="Focus hours" value={analytics.focusHours} />
          <StatCell
            label="Avg completion"
            value={
              analytics.averageCompletionMinutes != null
                ? formatDurationHours(analytics.averageCompletionMinutes)
                : '—'
            }
            hint={
              analytics.averageCompletionMinutes == null
                ? 'Needs more timed tasks'
                : 'From scheduled start/end'
            }
          />
          <StatCell
            label="Priority rate"
            value={
              analytics.priorityCompletionRate != null
                ? `${analytics.priorityCompletionRate}%`
                : '—'
            }
          />
          <StatCell
            label="Strongest day"
            value={analytics.mostProductiveDay?.label || '—'}
            hint={
              analytics.mostProductiveDay
                ? `${analytics.mostProductiveDay.completedOnDay} completed that day`
                : null
            }
          />
          <StatCell
            label="Best time"
            value={analytics.mostProductiveTime?.label || '—'}
            hint={
              analytics.mostProductiveTime
                ? `${analytics.mostProductiveTime.count} completions`
                : 'Needs completion timestamps'
            }
          />
          <StatCell
            label="Most postponed"
            value={analytics.mostPostponedCategory?.tag || '—'}
            hint={
              analytics.mostPostponedCategory
                ? `${analytics.mostPostponedCategory.count} rollovers`
                : null
            }
          />
        </div>
        {analytics.limitations?.note ? (
          <p className="wb-analytics-limit">{analytics.limitations.note}</p>
        ) : null}
      </section>

      <section className="wb-analytics-section" aria-labelledby="wb-analytics-week">
        <div className="wb-analytics-section-head">
          <h2 id="wb-analytics-week" className="wb-analytics-section-title">
            {weekly.label}
          </h2>
          <div className="wb-analytics-week-nav" role="group" aria-label="Week navigation">
            <button
              type="button"
              className="wb-mode-btn"
              onClick={() => setWeekOffset((prev) => prev - 1)}
              aria-label="Previous week"
            >
              ←
            </button>
            <button
              type="button"
              className="wb-mode-btn"
              onClick={() => setWeekOffset(0)}
              disabled={weekOffset === 0}
            >
              This week
            </button>
            <button
              type="button"
              className="wb-mode-btn"
              onClick={() => setWeekOffset((prev) => Math.min(0, prev + 1))}
              disabled={weekOffset >= 0}
              aria-label="Next week"
            >
              →
            </button>
          </div>
        </div>

        {!weekly.hasData ? (
          <div className="wb-state-panel is-compact">
            <p className="wb-state-title">Quiet week.</p>
            <p className="wb-state-copy">No planned or completed work in this range yet.</p>
          </div>
        ) : (
          <>
            <div className="wb-analytics-week-summary">
              <span>
                <strong>{weekly.planned}</strong> planned
              </span>
              <span>
                <strong>{weekly.completed}</strong> completed
              </span>
              <span>
                <strong>{weekly.completionRate}%</strong> completion
              </span>
              <span>
                <strong>{weekly.xp}</strong> XP
              </span>
              <span>
                <strong>{weekly.rolledOver}</strong> rolled over
              </span>
            </div>

            <div className="wb-analytics-day-bars" role="list">
              {weekly.days.map((day) => {
                const height = Math.round(
                  (Math.max(day.completedOnDay, day.planned ? day.completed : 0) /
                    maxDayCompletions) *
                    100
                );
                return (
                  <div key={day.dateKey} className="wb-analytics-day-bar" role="listitem">
                    <div className="wb-analytics-day-track" aria-hidden="true">
                      <div
                        className="wb-analytics-day-fill"
                        style={{ height: `${Math.max(height, day.planned || day.completedOnDay ? 8 : 0)}%` }}
                      />
                    </div>
                    <p className="wb-analytics-day-name">{day.shortLabel}</p>
                    <p className="wb-analytics-day-meta">
                      {day.completed}/{day.planned || '—'}
                    </p>
                    <p className="wb-analytics-day-rate">
                      {day.planned > 0 ? `${day.completionRate}%` : '—'}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="wb-analytics-week-highlights">
              <p>
                Most productive day:{' '}
                <strong>{weekly.mostProductiveDay?.label || '—'}</strong>
              </p>
              <p>
                Highest XP day: <strong>{weekly.highestXpDay?.label || '—'}</strong>
                {weekly.highestXpDay ? ` · ${weekly.highestXpDay.xp} XP` : ''}
              </p>
            </div>
          </>
        )}
      </section>

      <section className="wb-analytics-section" aria-labelledby="wb-analytics-trends">
        <h2 id="wb-analytics-trends" className="wb-analytics-section-title">
          Trends
        </h2>
        {trends.insufficientHistory ? (
          <div className="wb-state-panel is-compact">
            <p className="wb-state-title">Not enough history yet.</p>
            <p className="wb-state-copy">
              Complete another week of real work to unlock week-over-week comparisons.
            </p>
          </div>
        ) : (
          <div className="wb-analytics-trends">
            <TrendRow
              label="Completion rate"
              current={trends.completionRate.current}
              previous={trends.completionRate.previous}
              delta={trends.completionRate.delta}
              suffix="%"
            />
            <TrendRow
              label="XP"
              current={trends.xp.current}
              previous={trends.xp.previous}
              delta={trends.xp.delta}
            />
            <TrendRow
              label="Royal Score"
              current={trends.royalScore.current}
              previous={trends.royalScore.previous}
              delta={trends.royalScore.delta}
            />
          </div>
        )}
      </section>

      <section className="wb-analytics-section" aria-labelledby="wb-analytics-insights">
        <h2 id="wb-analytics-insights" className="wb-analytics-section-title">
          Smart insights
        </h2>
        {insightPack.insufficientData ? (
          <div className="wb-state-panel is-compact">
            <p className="wb-state-title">Patterns forming.</p>
            <p className="wb-state-copy">{insightPack.message}</p>
          </div>
        ) : (
          <ul className="wb-analytics-insights">
            {insightPack.insights.map((insight) => (
              <li key={insight.id}>{insight.text}</li>
            ))}
          </ul>
        )}
      </section>

      <section className="wb-analytics-section" aria-labelledby="wb-analytics-rollover">
        <h2 id="wb-analytics-rollover" className="wb-analytics-section-title">
          Rollover analysis
        </h2>
        {!rollovers.hasData ? (
          <div className="wb-state-panel is-compact">
            <p className="wb-state-title">Clean board.</p>
            <p className="wb-state-copy">No rolled-over tasks in this week.</p>
          </div>
        ) : (
          <>
            <p className="wb-analytics-rollover-count">
              Rolled over <strong>{rollovers.count}</strong> task
              {rollovers.count === 1 ? '' : 's'}
            </p>
            {rollovers.insights.length > 0 ? (
              <ul className="wb-analytics-insights">
                {rollovers.insights.map((insight) => (
                  <li key={insight.id}>{insight.text}</li>
                ))}
              </ul>
            ) : null}
            {rollovers.limitation ? (
              <p className="wb-analytics-limit">{rollovers.limitation}</p>
            ) : null}
          </>
        )}
      </section>
    </div>
  );
};

export default WorkboardAnalytics;
