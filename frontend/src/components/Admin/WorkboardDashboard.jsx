import React, { useMemo } from 'react';
import {
  buildTodaysMission,
  calculateDailyScore,
  calculateLevelProgress,
  calculateObjectiveProgress,
  calculateWeeklySummary,
  greetingForHour
} from '../../utils/workboardGamification';

const formatLongDate = (dateKey) => {
  const [year, month, day] = String(dateKey).split('-').map(Number);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  }).format(new Date(year, month - 1, day));
};

/**
 * Compact command center — answers "what should I do today?"
 */
const WorkboardDashboard = ({
  todayKey,
  weekStart,
  weekIndex,
  totalXp,
  royalScore,
  currentStreak,
  statsTasks,
  customMissionTitle,
  objectives = [],
  onOpenTask,
  onGoToday,
  onGoBoard,
  onGoAchievements,
  onGoProjects,
  onGoAnalytics,
  onGoLeaderboard
}) => {
  const mission = useMemo(
    () => buildTodaysMission(statsTasks, todayKey, customMissionTitle),
    [statsTasks, todayKey, customMissionTitle]
  );
  const daily = useMemo(
    () => calculateDailyScore(todayKey, statsTasks),
    [todayKey, statsTasks]
  );
  const weekly = useMemo(
    () => calculateWeeklySummary(weekStart, statsTasks, weekIndex),
    [weekStart, statsTasks, weekIndex]
  );
  const level = useMemo(() => calculateLevelProgress(totalXp), [totalXp]);
  const greeting = greetingForHour();
  const weekObjectives = objectives.filter((row) => row.weekStart === weekStart).slice(0, 3);

  return (
    <div className="wb-dash">
      <header className="wb-dash-hero">
        <p className="wb-game-kicker">Command Center</p>
        <h1 className="wb-dash-greeting">
          {greeting}, Royal Prince <span aria-hidden="true">👑</span>
        </h1>
        <p className="wb-dash-date">{formatLongDate(todayKey)}</p>

        <div className="wb-dash-metrics">
          <div className="wb-dash-metric">
            <p className="wb-game-kicker">Royal Score</p>
            <p className="wb-dash-metric-value">{royalScore}</p>
          </div>
          <div className="wb-dash-metric">
            <p className="wb-game-kicker">Level {level.level}</p>
            <p className="wb-dash-metric-value">{totalXp.toLocaleString()} XP</p>
          </div>
          <div className="wb-dash-metric">
            <p className="wb-game-kicker">Streak</p>
            <p className="wb-dash-metric-value">
              <span aria-hidden="true">🔥</span> {currentStreak} Day
              {currentStreak === 1 ? '' : 's'}
            </p>
          </div>
        </div>

        <div className="wb-dash-nav">
          <button type="button" className="wb-today-btn" onClick={onGoToday}>
            Today
          </button>
          <button type="button" className="wb-mode-btn" onClick={onGoBoard}>
            Taskboard
          </button>
          <button type="button" className="wb-mode-btn" onClick={onGoProjects}>
            Boss Battles
          </button>
          <button type="button" className="wb-mode-btn" onClick={onGoAchievements}>
            Achievements
          </button>
          {onGoAnalytics ? (
            <button type="button" className="wb-mode-btn" onClick={onGoAnalytics}>
              Analytics
            </button>
          ) : null}
          {onGoLeaderboard ? (
            <button type="button" className="wb-mode-btn" onClick={onGoLeaderboard}>
              Leaderboard
            </button>
          ) : null}
        </div>
      </header>

      <section className="wb-dash-card">
        <p className="wb-game-kicker">Today&apos;s Mission</p>
        {mission.empty ? (
          <p className="wb-mission-empty">No missions yet — capture one task and begin.</p>
        ) : (
          <>
            <h2 className="wb-dash-mission-title">{mission.title || 'Execute today\'s priorities'}</h2>
            <p className="wb-mission-meta">
              {mission.priorityCount} priority task{mission.priorityCount === 1 ? '' : 's'}
              {' · '}
              {mission.xpAvailable} XP available
              {' · '}
              Est. {mission.estimatedLabel}
            </p>
          </>
        )}
      </section>

      <section className="wb-dash-card">
        <div className="wb-dash-card-head">
          <p className="wb-game-kicker">Today&apos;s Priority Tasks</p>
          <p className="wb-dash-inline-score">
            {daily.planned === 0 ? '—' : `${daily.score} / 100`}
          </p>
        </div>
        {mission.openTasks.length === 0 ? (
          <p className="wb-mission-empty">
            {mission.empty ? 'Nothing planned for today.' : 'All clear — today\'s tasks are done.'}
          </p>
        ) : (
          <ul className="wb-dash-task-list">
            {mission.openTasks.slice(0, 6).map((task) => (
              <li key={task._id}>
                <button
                  type="button"
                  className="wb-dash-task-btn"
                  onClick={() => onOpenTask?.(task)}
                >
                  <span className="wb-dash-task-title">{task.title}</span>
                  <span className="wb-dash-task-meta">
                    {task.priority && task.priority !== 'NORMAL' ? task.priority : 'Open'}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="wb-dash-split">
        <section className="wb-dash-card">
          <p className="wb-game-kicker">Today&apos;s Progress</p>
          <p className="wb-dash-progress-line">
            <strong>{daily.completed}</strong> / {daily.planned} completed
          </p>
          <div className="wb-xp-track" aria-hidden="true">
            <span
              className="wb-xp-fill"
              style={{ width: `${daily.planned ? daily.completionRate : 0}%` }}
            />
          </div>
        </section>

        <section className="wb-dash-card">
          <p className="wb-game-kicker">Weekly Progress</p>
          <p className="wb-dash-progress-line">
            <strong>{weekly.completed}</strong> / {weekly.planned} · {weekly.completionRate}%
          </p>
          <div className="wb-xp-track" aria-hidden="true">
            <span className="wb-xp-fill" style={{ width: `${weekly.completionRate}%` }} />
          </div>
        </section>
      </div>

      {weekObjectives.length > 0 ? (
        <section className="wb-dash-card">
          <p className="wb-game-kicker">Weekly Objectives</p>
          <ul className="wb-objective-list">
            {weekObjectives.map((objective) => {
              const progress = calculateObjectiveProgress(objective);
              return (
                <li key={objective._id} className="wb-objective-item">
                  <div className="wb-objective-head">
                    <span>{objective.title}</span>
                    <span>
                      {progress.current} / {progress.target}
                    </span>
                  </div>
                  <div className="wb-xp-track" aria-hidden="true">
                    <span className="wb-xp-fill" style={{ width: `${progress.percent}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
    </div>
  );
};

export default WorkboardDashboard;
