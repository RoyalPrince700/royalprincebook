/**
 * Day-level planning analytics from task records.
 * Planned counts come from originalDate (frozen at first schedule), not a fake counter.
 *
 * Legacy tasks without originalDate fall back to date (assumes never rolled).
 */

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const toDateKeyFromDate = (value) => {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const normalizeStatus = (status) => {
  const value = String(status || 'started');
  if (value === 'todo') return 'started';
  if (value === 'blocked') return 'postponed';
  return value;
};

/** First scheduled date — never rewritten when the task moves. */
const getOriginalDate = (task) => {
  const original = task?.originalDate;
  if (DATE_RE.test(String(original || ''))) return original;
  if (DATE_RE.test(String(task?.date || ''))) return task.date;
  return '';
};

const getCurrentDate = (task) =>
  DATE_RE.test(String(task?.date || '')) ? task.date : '';

const isCancelled = (task) => normalizeStatus(task?.status) === 'cancelled';
const isCompleted = (task) => normalizeStatus(task?.status) === 'completed';
const isPostponed = (task) => normalizeStatus(task?.status) === 'postponed';

/** Completed on calendar day D (from completedAt when present). */
const getCompletedOnDate = (task) => {
  if (!isCompleted(task)) return '';
  const fromStamp = toDateKeyFromDate(task?.completedAt);
  if (fromStamp) return fromStamp;
  return getCurrentDate(task);
};

/**
 * Was this task originally planned for dateKey?
 * Excludes cancelled from the "active plan" by default via options.
 */
const wasOriginallyPlannedFor = (task, dateKey, { includeCancelled = false } = {}) => {
  if (getOriginalDate(task) !== dateKey) return false;
  if (!includeCancelled && isCancelled(task)) return false;
  return true;
};

/**
 * Rolled over away from its original plan day.
 * originalDate === D and current date !== D.
 */
const isRolledOverFrom = (task, dateKey) => {
  if (getOriginalDate(task) !== dateKey) return false;
  if (isCancelled(task)) return false;
  const current = getCurrentDate(task);
  return Boolean(current) && current !== dateKey;
};

/**
 * Full day planning snapshot for analytics / Overachiever.
 *
 * @param {string} dateKey YYYY-MM-DD
 * @param {Array} tasks
 * @returns {{
 *   date: string,
 *   planned: number,
 *   completed: number,
 *   rolledOver: number,
 *   postponed: number,
 *   cancelled: number,
 *   completionRate: number,
 *   completedOnDay: number,
 *   overachieved: boolean,
 *   plannedTasks: Array,
 *   completedTasks: Array,
 *   rolledOverTasks: Array,
 *   cancelledTasks: Array
 * }}
 */
const calculateDayPlanningStats = (dateKey, tasks = []) => {
  const list = Array.isArray(tasks) ? tasks : [];

  const plannedTasks = list.filter((task) => wasOriginallyPlannedFor(task, dateKey));
  const cancelledTasks = list.filter(
    (task) => getOriginalDate(task) === dateKey && isCancelled(task)
  );
  const completedTasks = plannedTasks.filter(isCompleted);
  const rolledOverTasks = list.filter((task) => isRolledOverFrom(task, dateKey));
  const postponedTasks = plannedTasks.filter(
    (task) => isPostponed(task) && getCurrentDate(task) === dateKey
  );

  // Completions that landed on this calendar day (may include catch-up from other plan days).
  const completedOnDayTasks = list.filter(
    (task) => getCompletedOnDate(task) === dateKey
  );

  const planned = plannedTasks.length;
  const completed = completedTasks.length;
  const rolledOver = rolledOverTasks.length;
  const postponed = postponedTasks.length;
  const cancelled = cancelledTasks.length;
  const completedOnDay = completedOnDayTasks.length;
  const completionRate =
    planned === 0 ? 0 : Math.round((completed / planned) * 100);

  return {
    date: dateKey,
    planned,
    completed,
    rolledOver,
    postponed,
    cancelled,
    completionRate,
    completedOnDay,
    // Real overachiever: finished more work units this calendar day than originally planned for it.
    overachieved: planned > 0 && completedOnDay > planned,
    plannedTasks,
    completedTasks,
    rolledOverTasks,
    cancelledTasks,
    completedOnDayTasks
  };
};

module.exports = {
  getOriginalDate,
  getCurrentDate,
  getCompletedOnDate,
  wasOriginallyPlannedFor,
  isRolledOverFrom,
  isCancelled,
  isCompleted,
  isPostponed,
  calculateDayPlanningStats,
  toDateKeyFromDate
};
