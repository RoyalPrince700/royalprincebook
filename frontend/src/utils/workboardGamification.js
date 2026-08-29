/**
 * Taskboard gamification — XP, levels, scores, streaks.
 * Keep formulas here so UI components stay thin.
 */

/** Configurable XP by task priority. */
export const XP_BY_PRIORITY = {
  LOW: 10,
  NORMAL: 25,
  HIGH: 50,
  CRITICAL: 100
};

export const PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'Low' },
  { value: 'NORMAL', label: 'Normal' },
  { value: 'HIGH', label: 'High' },
  { value: 'CRITICAL', label: 'Critical' }
];

export const DEFAULT_PRIORITY = 'NORMAL';
export const XP_PER_LEVEL = 500;
export const PRODUCTIVE_DAY_THRESHOLD = 0.7;

/** Royal Score weights (must sum to 1). Easy to retune later. */
export const ROYAL_SCORE_WEIGHTS = {
  completion: 0.5,
  priority: 0.3,
  streak: 0.2
};

/** Daily score weights (must sum to 1). */
export const DAILY_SCORE_WEIGHTS = {
  completion: 0.55,
  priority: 0.3,
  consistency: 0.15
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const normalizePriority = (priority) => {
  const key = String(priority || DEFAULT_PRIORITY).toUpperCase();
  return Object.prototype.hasOwnProperty.call(XP_BY_PRIORITY, key) ? key : DEFAULT_PRIORITY;
};

const isCompleted = (task) => String(task?.status || '') === 'completed';

/** Planned = active work (postponed/cancelled do not punish completion rate). */
const isPlanned = (task) => {
  const status = String(task?.status || '');
  return status !== 'postponed' && status !== 'cancelled';
};

const isHighPriority = (task) => {
  const priority = normalizePriority(task?.priority);
  return priority === 'HIGH' || priority === 'CRITICAL';
};

/**
 * XP awarded for completing a single task.
 * @param {{ priority?: string }} task
 * @returns {number}
 */
export const calculateTaskXP = (task) => {
  const priority = normalizePriority(task?.priority);
  return XP_BY_PRIORITY[priority] ?? XP_BY_PRIORITY[DEFAULT_PRIORITY];
};

/**
 * @param {number} totalXP
 * @returns {number} 1-based level
 */
export const calculateLevel = (totalXP) => {
  const xp = Math.max(0, Number(totalXP) || 0);
  return Math.floor(xp / XP_PER_LEVEL) + 1;
};

/**
 * XP remaining until the next level.
 * @param {number} totalXP
 * @returns {number}
 */
export const calculateXPToNextLevel = (totalXP) => {
  const xp = Math.max(0, Number(totalXP) || 0);
  const intoLevel = xp % XP_PER_LEVEL;
  return intoLevel === 0 && xp > 0 ? XP_PER_LEVEL : XP_PER_LEVEL - intoLevel;
};

/**
 * Progress within the current level.
 * @param {number} totalXP
 * @returns {{ level: number, currentXP: number, levelXP: number, percent: number, xpToNext: number }}
 */
export const calculateLevelProgress = (totalXP) => {
  const xp = Math.max(0, Number(totalXP) || 0);
  const level = calculateLevel(xp);
  const currentXP = xp % XP_PER_LEVEL;
  const xpToNext = calculateXPToNextLevel(xp);

  return {
    level,
    currentXP,
    levelXP: XP_PER_LEVEL,
    percent: clamp((currentXP / XP_PER_LEVEL) * 100, 0, 100),
    xpToNext
  };
};

const ratePercent = (done, total) => {
  if (!total || total <= 0) return 100;
  return clamp((done / total) * 100, 0, 100);
};

/**
 * Soft daily productivity score (0–100).
 * Missed tasks reduce the score gradually — one miss does not collapse the day.
 *
 * @param {string} dateKey YYYY-MM-DD
 * @param {Array} tasks flat task list (or day subset)
 * @returns {{ score: number, planned: number, completed: number, completionRate: number }}
 */
export const calculateDailyScore = (dateKey, tasks = []) => {
  const dayTasks = (tasks || []).filter((task) => task?.date === dateKey);
  const plannedTasks = dayTasks.filter(isPlanned);
  const planned = plannedTasks.length;
  const completedTasks = plannedTasks.filter(isCompleted);
  const completed = completedTasks.length;

  if (planned === 0) {
    return {
      score: 0,
      planned: 0,
      completed: 0,
      completionRate: 0
    };
  }

  const completionRate = ratePercent(completed, planned);

  const priorityPlanned = plannedTasks.filter(isHighPriority);
  const priorityCompleted = priorityPlanned.filter(isCompleted);
  const priorityRate = ratePercent(priorityCompleted.length, priorityPlanned.length);

  // Consistency: full credit at productive-day threshold, soft ramp below.
  const consistencyRate =
    completionRate >= PRODUCTIVE_DAY_THRESHOLD * 100
      ? 100
      : (completionRate / (PRODUCTIVE_DAY_THRESHOLD * 100)) * 100;

  const raw =
    DAILY_SCORE_WEIGHTS.completion * completionRate +
    DAILY_SCORE_WEIGHTS.priority * priorityRate +
    DAILY_SCORE_WEIGHTS.consistency * consistencyRate;

  // Soft floor: never punish harder than ~completionRate * 0.85 for near-miss days.
  const softened = Math.max(raw, completionRate * 0.85);

  return {
    score: Math.round(clamp(softened, 0, 100)),
    planned,
    completed,
    completionRate: Math.round(completionRate)
  };
};

const weekdayKeysDescending = (fromDateKey, count) => {
  const keys = [];
  const [year, month, day] = String(fromDateKey).split('-').map(Number);
  const cursor = new Date(year, month - 1, day);

  while (keys.length < count) {
    const y = cursor.getFullYear();
    const m = String(cursor.getMonth() + 1).padStart(2, '0');
    const d = String(cursor.getDate()).padStart(2, '0');
    keys.push(`${y}-${m}-${d}`);
    cursor.setDate(cursor.getDate() - 1);
  }

  return keys;
};

const isProductiveDay = (dateKey, tasks) => {
  const dayTasks = (tasks || []).filter((task) => task?.date === dateKey && isPlanned(task));
  if (dayTasks.length === 0) return false;
  const completed = dayTasks.filter(isCompleted).length;
  return completed / dayTasks.length >= PRODUCTIVE_DAY_THRESHOLD;
};

/**
 * Current productive-day streak ending at today (includes weekends).
 * Days with zero planned tasks break the streak.
 *
 * @param {Array} tasks
 * @param {string} [todayKey]
 * @returns {number}
 */
export const calculateCurrentStreak = (tasks = [], todayKey) => {
  const anchor =
    todayKey ||
    (() => {
      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const d = String(now.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    })();

  const lookback = weekdayKeysDescending(anchor, 120);
  let streak = 0;

  for (const dateKey of lookback) {
    const plannedCount = (tasks || []).filter(
      (task) => task?.date === dateKey && isPlanned(task)
    ).length;

    // If today has no planned work yet, skip it and continue from prior days.
    if (plannedCount === 0) {
      if (streak === 0 && dateKey === anchor) continue;
      break;
    }

    if (isProductiveDay(dateKey, tasks)) {
      streak += 1;
    } else {
      break;
    }
  }

  return streak;
};

/**
 * Longest historical productive-day streak in the provided task set.
 *
 * @param {Array} tasks
 * @returns {number}
 */
export const calculateLongestStreak = (tasks = []) => {
  const dates = [
    ...new Set(
      (tasks || [])
        .map((task) => task?.date)
        .filter((date) => /^\d{4}-\d{2}-\d{2}$/.test(String(date || '')))
    )
  ].sort();

  if (dates.length === 0) return 0;

  const first = dates[0];
  const last = dates[dates.length - 1];
  const [y1, m1, d1] = first.split('-').map(Number);
  const [y2, m2, d2] = last.split('-').map(Number);
  const cursor = new Date(y1, m1 - 1, d1);
  const end = new Date(y2, m2 - 1, d2);

  let longest = 0;
  let current = 0;

  while (cursor <= end) {
    const y = cursor.getFullYear();
    const m = String(cursor.getMonth() + 1).padStart(2, '0');
    const d = String(cursor.getDate()).padStart(2, '0');
    const dateKey = `${y}-${m}-${d}`;

    if (isProductiveDay(dateKey, tasks)) {
      current += 1;
      longest = Math.max(longest, current);
    } else {
      // Only break when the day had planned work, or we already started a streak
      // and hit a gap day that had tasks in range. Empty days break streaks.
      current = 0;
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return longest;
};

/**
 * Overall productivity metric 0–100 from real task data.
 *
 * @param {{ tasks?: Array, currentStreak?: number, todayKey?: string }} data
 * @returns {{ score: number, completionRate: number, priorityRate: number, streakScore: number }}
 */
export const calculateRoyalScore = (data = {}) => {
  const tasks = data.tasks || [];
  const plannedTasks = tasks.filter(isPlanned);
  const completedTasks = plannedTasks.filter(isCompleted);

  const completionRate = ratePercent(completedTasks.length, plannedTasks.length);

  const priorityPlanned = plannedTasks.filter(isHighPriority);
  const priorityCompleted = priorityPlanned.filter(isCompleted);
  const priorityRate = ratePercent(priorityCompleted.length, priorityPlanned.length);

  const streak =
    typeof data.currentStreak === 'number'
      ? data.currentStreak
      : calculateCurrentStreak(tasks, data.todayKey);

  // Cap streak contribution at 10 productive days.
  const streakScore = clamp((Math.min(streak, 10) / 10) * 100, 0, 100);

  if (plannedTasks.length === 0) {
    return {
      score: 0,
      completionRate: 0,
      priorityRate: 0,
      streakScore: Math.round(streakScore)
    };
  }

  const raw =
    ROYAL_SCORE_WEIGHTS.completion * completionRate +
    ROYAL_SCORE_WEIGHTS.priority * priorityRate +
    ROYAL_SCORE_WEIGHTS.streak * streakScore;

  return {
    score: Math.round(clamp(raw, 0, 100)),
    completionRate: Math.round(completionRate),
    priorityRate: Math.round(priorityRate),
    streakScore: Math.round(streakScore)
  };
};

/**
 * Compact weekly rollup for the Taskboard summary strip.
 * Planned / completed / rate come from calculateDayPlanningStats (not current-date proxies).
 *
 * @param {string} weekStart YYYY-MM-DD (Sunday)
 * @param {Array} tasks
 * @returns {{ planned: number, completed: number, completionRate: number, xp: number, streak: number, label: string }}
 */
export const calculateWeeklySummary = (weekStart, tasks = [], weekIndex = 0) => {
  const weekDates = [];
  const [year, month, day] = String(weekStart).split('-').map(Number);
  const cursor = new Date(year, month - 1, day);
  for (let i = 0; i < 7; i += 1) {
    const y = cursor.getFullYear();
    const m = String(cursor.getMonth() + 1).padStart(2, '0');
    const d = String(cursor.getDate()).padStart(2, '0');
    weekDates.push(`${y}-${m}-${d}`);
    cursor.setDate(cursor.getDate() + 1);
  }

  let planned = 0;
  let completed = 0;
  let xp = 0;

  weekDates.forEach((dateKey) => {
    const day = calculateDayPlanningStats(dateKey, tasks);
    planned += day.planned;
    completed += day.completed;
    xp += day.completedOnDayTasks.reduce((sum, task) => {
      const awarded = Number(task?.xpAwarded);
      return sum + (Number.isFinite(awarded) && awarded > 0 ? awarded : 0);
    }, 0);
  });

  const completionRate = planned === 0 ? 0 : Math.round((completed / planned) * 100);

  return {
    label: `Week ${weekIndex + 1}`,
    planned,
    completed,
    completionRate,
    xp,
    streak: calculateCurrentStreak(tasks)
  };
};

/**
 * Flatten tasksByDate map → array.
 * @param {Record<string, Array>} tasksByDate
 * @returns {Array}
 */
export const flattenTasksByDate = (tasksByDate = {}) =>
  Object.values(tasksByDate || {}).flatMap((list) => (Array.isArray(list) ? list : []));

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const toDateKeyFromValue = (value) => {
  if (!value) return '';
  if (DATE_RE.test(String(value))) return String(value);
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/** First scheduled date; legacy tasks fall back to current date. */
export const getOriginalDate = (task) => {
  if (DATE_RE.test(String(task?.originalDate || ''))) return task.originalDate;
  if (DATE_RE.test(String(task?.date || ''))) return task.date;
  return '';
};

/**
 * Day planning analytics from scheduled task records (no fake plannedCount).
 * planned = originally scheduled for dateKey (excludes cancelled)
 * completed = of that plan, now completed
 * rolledOver = originally for dateKey, current date moved away
 * completedOnDay = completions whose completedAt falls on dateKey
 * overachieved = completedOnDay > planned
 */
export const calculateDayPlanningStats = (dateKey, tasks = []) => {
  const list = Array.isArray(tasks) ? tasks : [];
  const statusOf = (task) => String(task?.status || '');

  const plannedTasks = list.filter((task) => {
    if (getOriginalDate(task) !== dateKey) return false;
    return statusOf(task) !== 'cancelled';
  });
  const cancelledTasks = list.filter(
    (task) => getOriginalDate(task) === dateKey && statusOf(task) === 'cancelled'
  );
  const completedTasks = plannedTasks.filter((task) => statusOf(task) === 'completed');
  const rolledOverTasks = list.filter((task) => {
    if (getOriginalDate(task) !== dateKey) return false;
    if (statusOf(task) === 'cancelled') return false;
    const current = DATE_RE.test(String(task?.date || '')) ? task.date : '';
    return Boolean(current) && current !== dateKey;
  });
  const postponedTasks = plannedTasks.filter(
    (task) => statusOf(task) === 'postponed' && task.date === dateKey
  );

  const completedOnDayTasks = list.filter((task) => {
    if (statusOf(task) !== 'completed') return false;
    const completedDay =
      toDateKeyFromValue(task?.completedAt) ||
      (DATE_RE.test(String(task?.date || '')) ? task.date : '');
    return completedDay === dateKey;
  });

  const planned = plannedTasks.length;
  const completed = completedTasks.length;
  const rolledOver = rolledOverTasks.length;
  const postponed = postponedTasks.length;
  const cancelled = cancelledTasks.length;
  const completedOnDay = completedOnDayTasks.length;
  const completionRate = planned === 0 ? 0 : Math.round((completed / planned) * 100);

  return {
    date: dateKey,
    planned,
    completed,
    rolledOver,
    postponed,
    cancelled,
    completionRate,
    completedOnDay,
    overachieved: planned > 0 && completedOnDay > planned,
    plannedTasks,
    completedTasks,
    rolledOverTasks,
    cancelledTasks,
    completedOnDayTasks
  };
};

const PRIORITY_RANK = { CRITICAL: 4, HIGH: 3, NORMAL: 2, LOW: 1 };

const estimateMinutesFromTask = (task) => {
  const start = task?.startTime;
  const end = task?.endTime;
  if (!start || !end || !/^\d{1,2}:\d{2}$/.test(start) || !/^\d{1,2}:\d{2}$/.test(end)) {
    return 60;
  }
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  const mins = eh * 60 + em - (sh * 60 + sm);
  if (!Number.isFinite(mins) || mins <= 0) return 60;
  return Math.min(mins, 8 * 60);
};

export const formatDurationHours = (totalMinutes) => {
  const mins = Math.max(0, Math.round(Number(totalMinutes) || 0));
  const hours = Math.floor(mins / 60);
  const rem = mins % 60;
  if (hours <= 0) return `${rem}m`;
  if (rem === 0) return `${hours}h`;
  return `${hours}h ${String(rem).padStart(2, '0')}m`;
};

export const formatFocusClock = (totalSeconds) => {
  const secs = Math.max(0, Math.floor(Number(totalSeconds) || 0));
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

/**
 * Derive today's mission from real tasks (+ optional custom title).
 */
export const buildTodaysMission = (tasks = [], todayKey, customTitle = '') => {
  const dayTasks = (tasks || []).filter((task) => task?.date === todayKey && isPlanned(task));
  const openTasks = dayTasks.filter((task) => !isCompleted(task));
  const priorityTasks = openTasks
    .slice()
    .sort(
      (a, b) =>
        (PRIORITY_RANK[normalizePriority(b.priority)] || 0) -
        (PRIORITY_RANK[normalizePriority(a.priority)] || 0)
    );

  const focusPool = priorityTasks.length > 0 ? priorityTasks : openTasks;
  const top = focusPool[0] || null;
  const priorityCount = openTasks.filter(isHighPriority).length || Math.min(openTasks.length, 3);
  const xpAvailable = openTasks.reduce((sum, task) => sum + calculateTaskXP(task), 0);
  const estimatedMinutes = openTasks.reduce((sum, task) => sum + estimateMinutesFromTask(task), 0);

  const autoTitle = top?.title || '';
  const title = String(customTitle || '').trim() || autoTitle;

  return {
    title,
    hasCustomTitle: Boolean(String(customTitle || '').trim()),
    empty: dayTasks.length === 0,
    openCount: openTasks.length,
    priorityCount: Math.max(priorityCount, openTasks.length > 0 ? 1 : 0),
    xpAvailable,
    estimatedMinutes,
    estimatedLabel: formatDurationHours(estimatedMinutes),
    topTask: top,
    tasks: dayTasks,
    openTasks
  };
};

export const calculateProjectProgress = (tasks = []) => {
  const planned = (tasks || []).filter(isPlanned);
  const completed = planned.filter(isCompleted);
  const total = planned.length;
  const done = completed.length;
  return {
    total,
    done,
    percent: total === 0 ? 0 : Math.round((done / total) * 100)
  };
};

export const calculateObjectiveProgress = (objective) => {
  const target = Math.max(1, Number(objective?.target) || 1);
  const current = Math.max(0, Number(objective?.current) || 0);
  const percent = Math.min(100, Math.round((current / target) * 100));
  return { target, current, percent, completed: Boolean(objective?.completed) || current >= target };
};

export const ACHIEVEMENT_DEFS = [
  {
    id: 'first_step',
    title: 'FIRST STEP',
    description: 'Complete your first task.'
  },
  {
    id: 'execution_mode',
    title: 'EXECUTION MODE',
    description: 'Complete 5 tasks in one day.'
  },
  {
    id: 'consistent',
    title: 'CONSISTENT',
    description: 'Maintain a 3-day streak.'
  },
  {
    id: 'on_fire',
    title: 'ON FIRE',
    description: 'Maintain a 7-day streak.'
  },
  {
    id: 'perfect_week',
    title: 'PERFECT WEEK',
    description: 'Complete all critical tasks in a week.'
  },
  {
    id: 'overachiever',
    title: 'OVERACHIEVER',
    description: 'Complete more tasks than originally planned in a day.'
  },
  {
    id: 'deep_worker',
    title: 'DEEP WORKER',
    description: 'Accumulate 10 hours of focus time.'
  },
  {
    id: 'royalty',
    title: 'ROYALTY',
    description: 'Reach Level 10.'
  },
  {
    id: 'legend',
    title: 'LEGEND',
    description: 'Reach Level 25.'
  }
];

export const mergeAchievementList = (serverList = []) => {
  const byId = new Map((serverList || []).map((row) => [row.id, row]));
  return ACHIEVEMENT_DEFS.map((def) => {
    const row = byId.get(def.id);
    return {
      ...def,
      unlocked: Boolean(row?.unlocked),
      unlockedAt: row?.unlockedAt || null
    };
  });
};

export const greetingForHour = (date = new Date()) => {
  const hour = date.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

/* ——— Phase 3: Analytics built on calculateDayPlanningStats ——— */

const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const shiftDateKeyBy = (dateKey, amount) => {
  if (!DATE_RE.test(String(dateKey || ''))) return '';
  const [year, month, day] = String(dateKey).split('-').map(Number);
  const cursor = new Date(year, month - 1, day);
  cursor.setDate(cursor.getDate() + amount);
  const y = cursor.getFullYear();
  const m = String(cursor.getMonth() + 1).padStart(2, '0');
  const d = String(cursor.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

/** Sunday–Saturday keys starting at weekStart (Sunday). */
export const workWeekDateKeys = (weekStart) => {
  if (!DATE_RE.test(String(weekStart || ''))) return [];
  return [0, 1, 2, 3, 4, 5, 6].map((offset) => shiftDateKeyBy(weekStart, offset));
};

const sumXpFromTasks = (tasks = []) =>
  (tasks || []).reduce((sum, task) => {
    const awarded = Number(task?.xpAwarded);
    if (Number.isFinite(awarded) && awarded > 0) return sum + awarded;
    return sum;
  }, 0);

const sumFocusSeconds = (tasks = []) =>
  (tasks || []).reduce((sum, task) => sum + Math.max(0, Number(task?.focusTime) || 0), 0);

/**
 * Weekly rollup using calculateDayPlanningStats for each weekday.
 * planned/completed/rolledOver/cancelled are planning-truthful.
 */
export const calculatePlanningWeeklyStats = (weekStart, tasks = [], weekIndex = 0) => {
  const days = workWeekDateKeys(weekStart).map((dateKey) => {
    const stats = calculateDayPlanningStats(dateKey, tasks);
    const xp = sumXpFromTasks(stats.completedOnDayTasks);
    const focusSeconds = sumFocusSeconds([
      ...stats.plannedTasks,
      ...stats.completedOnDayTasks
    ]);
    // Deduplicate focus if a task appears in both lists
    const seen = new Set();
    let focusUnique = 0;
    [...stats.plannedTasks, ...stats.completedOnDayTasks].forEach((task) => {
      const id = String(task?._id || task?.id || '');
      if (id && seen.has(id)) return;
      if (id) seen.add(id);
      focusUnique += Math.max(0, Number(task?.focusTime) || 0);
    });

    return {
      dateKey,
      label: WEEKDAY_NAMES[new Date(`${dateKey}T12:00:00`).getDay()] || dateKey,
      shortLabel: (WEEKDAY_NAMES[new Date(`${dateKey}T12:00:00`).getDay()] || '').slice(0, 3),
      planned: stats.planned,
      completed: stats.completed,
      completedOnDay: stats.completedOnDay,
      rolledOver: stats.rolledOver,
      cancelled: stats.cancelled,
      completionRate: stats.completionRate,
      overachieved: stats.overachieved,
      xp,
      focusSeconds: focusUnique || focusSeconds
    };
  });

  const planned = days.reduce((sum, day) => sum + day.planned, 0);
  const completed = days.reduce((sum, day) => sum + day.completed, 0);
  const rolledOver = days.reduce((sum, day) => sum + day.rolledOver, 0);
  const cancelled = days.reduce((sum, day) => sum + day.cancelled, 0);
  const completedOnDay = days.reduce((sum, day) => sum + day.completedOnDay, 0);
  const xp = days.reduce((sum, day) => sum + day.xp, 0);
  const focusSeconds = days.reduce((sum, day) => sum + day.focusSeconds, 0);
  const completionRate = planned === 0 ? 0 : Math.round((completed / planned) * 100);

  const productiveDays = days.filter((day) => day.planned > 0 && day.completionRate >= PRODUCTIVE_DAY_THRESHOLD * 100);
  const mostProductiveDay = days
    .filter((day) => day.planned > 0)
    .slice()
    .sort((a, b) => {
      if (b.completedOnDay !== a.completedOnDay) return b.completedOnDay - a.completedOnDay;
      return b.completionRate - a.completionRate;
    })[0] || null;

  const highestXpDay = days
    .filter((day) => day.xp > 0)
    .slice()
    .sort((a, b) => b.xp - a.xp)[0] || null;

  return {
    label: `Week ${weekIndex + 1}`,
    weekStart,
    days,
    planned,
    completed,
    rolledOver,
    cancelled,
    completedOnDay,
    completionRate,
    xp,
    focusSeconds,
    focusHours: Math.round((focusSeconds / 3600) * 10) / 10,
    productiveDayCount: productiveDays.length,
    mostProductiveDay,
    highestXpDay,
    hasData: planned > 0 || completedOnDay > 0 || xp > 0
  };
};

const collectUniquePlanDays = (tasks = []) => {
  const set = new Set();
  (tasks || []).forEach((task) => {
    const key = getOriginalDate(task);
    if (DATE_RE.test(key)) set.add(key);
  });
  (tasks || []).forEach((task) => {
    const completedDay =
      toDateKeyFromValue(task?.completedAt) ||
      (DATE_RE.test(String(task?.date || '')) ? task.date : '');
    if (DATE_RE.test(completedDay)) set.add(completedDay);
  });
  return [...set].sort();
};

/**
 * Period analytics from real task history.
 * Daily planning numbers always come from calculateDayPlanningStats.
 */
export const buildProductivityAnalytics = ({
  tasks = [],
  todayKey,
  totalXp = 0,
  currentStreak,
  longestStreak
} = {}) => {
  const list = Array.isArray(tasks) ? tasks : [];
  const planDays = collectUniquePlanDays(list);
  const dayStats = planDays.map((dateKey) => calculateDayPlanningStats(dateKey, list));

  const planned = dayStats.reduce((sum, day) => sum + day.planned, 0);
  const completed = dayStats.reduce((sum, day) => sum + day.completed, 0);
  const rolledOver = dayStats.reduce((sum, day) => sum + day.rolledOver, 0);
  const cancelled = dayStats.reduce((sum, day) => sum + day.cancelled, 0);
  const completionRate = planned === 0 ? 0 : Math.round((completed / planned) * 100);

  const completedTasks = list.filter((task) => String(task?.status || '') === 'completed');
  const xpEarned = sumXpFromTasks(completedTasks);
  const focusSeconds = sumFocusSeconds(list);
  const focusHours = Math.round((focusSeconds / 3600) * 10) / 10;

  const streak =
    typeof currentStreak === 'number' ? currentStreak : calculateCurrentStreak(list, todayKey);
  const longest =
    typeof longestStreak === 'number' ? longestStreak : calculateLongestStreak(list);
  const royal = calculateRoyalScore({ tasks: list, currentStreak: streak, todayKey });

  const priorityPlanned = list.filter((task) => {
    if (String(task?.status || '') === 'cancelled') return false;
    return isHighPriority(task);
  });
  const priorityCompleted = priorityPlanned.filter(isCompleted);
  const priorityCompletionRate =
    priorityPlanned.length === 0
      ? null
      : Math.round((priorityCompleted.length / priorityPlanned.length) * 100);

  // Average completion duration from start/end times when both present.
  const durations = completedTasks
    .map((task) => {
      const start = task?.startTime;
      const end = task?.endTime;
      if (!start || !end || !/^\d{1,2}:\d{2}$/.test(start) || !/^\d{1,2}:\d{2}$/.test(end)) {
        return null;
      }
      const [sh, sm] = start.split(':').map(Number);
      const [eh, em] = end.split(':').map(Number);
      const mins = eh * 60 + em - (sh * 60 + sm);
      return Number.isFinite(mins) && mins > 0 ? Math.min(mins, 8 * 60) : null;
    })
    .filter((value) => value != null);
  const averageCompletionMinutes =
    durations.length >= 3
      ? Math.round(durations.reduce((sum, value) => sum + value, 0) / durations.length)
      : null;

  const mostProductiveDay = dayStats
    .filter((day) => day.planned > 0 || day.completedOnDay > 0)
    .slice()
    .sort((a, b) => {
      if (b.completedOnDay !== a.completedOnDay) return b.completedOnDay - a.completedOnDay;
      return b.completionRate - a.completionRate;
    })[0] || null;

  // Most productive hour from completedAt timestamps only (no fabrication).
  const hourBuckets = new Map();
  completedTasks.forEach((task) => {
    if (!task?.completedAt) return;
    const date = new Date(task.completedAt);
    if (Number.isNaN(date.getTime())) return;
    const hour = date.getHours();
    hourBuckets.set(hour, (hourBuckets.get(hour) || 0) + 1);
  });
  let mostProductiveTime = null;
  if (hourBuckets.size >= 3) {
    const top = [...hourBuckets.entries()].sort((a, b) => b[1] - a[1])[0];
    if (top && top[1] >= 2) {
      const hour = top[0];
      const suffix = hour >= 12 ? 'PM' : 'AM';
      const display = hour % 12 === 0 ? 12 : hour % 12;
      mostProductiveTime = {
        hour,
        label: `${display}:00 ${suffix}`,
        count: top[1]
      };
    }
  }

  // Most postponed category = tag among rolled-over tasks with enough signal.
  const tagCounts = new Map();
  dayStats.forEach((day) => {
    day.rolledOverTasks.forEach((task) => {
      const tag = String(task?.tag || '').trim();
      if (!tag) return;
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });
  let mostPostponedCategory = null;
  if (tagCounts.size > 0) {
    const top = [...tagCounts.entries()].sort((a, b) => b[1] - a[1])[0];
    if (top && top[1] >= 2) {
      mostPostponedCategory = { tag: top[0], count: top[1] };
    }
  }

  const legacyWithoutOriginal = list.filter(
    (task) => !DATE_RE.test(String(task?.originalDate || ''))
  ).length;
  const missingCompletedAt = completedTasks.filter((task) => !task?.completedAt).length;

  return {
    hasData: planned > 0 || completed > 0 || xpEarned > 0 || focusSeconds > 0,
    planned,
    completed,
    rolledOver,
    cancelled,
    completionRate,
    xpEarned,
    totalXp: Math.max(0, Number(totalXp) || 0),
    royalScore: royal.score,
    currentStreak: streak,
    longestStreak: longest,
    focusSeconds,
    focusHours,
    averageCompletionMinutes,
    priorityCompletionRate,
    mostProductiveDay: mostProductiveDay
      ? {
          date: mostProductiveDay.date,
          label: WEEKDAY_NAMES[new Date(`${mostProductiveDay.date}T12:00:00`).getDay()],
          completedOnDay: mostProductiveDay.completedOnDay,
          completionRate: mostProductiveDay.completionRate,
          planned: mostProductiveDay.planned
        }
      : null,
    mostProductiveTime,
    mostPostponedCategory,
    dayCount: planDays.length,
    limitations: {
      legacyWithoutOriginal,
      missingCompletedAt,
      note:
        legacyWithoutOriginal > 0 || missingCompletedAt > 0
          ? 'Some older tasks lack full planning or completion timestamps. Rollover and time-of-day insights only use tasks with real history.'
          : null
    }
  };
};

/**
 * Compare current week vs previous week using planning-based weekly stats.
 */
export const calculateProductivityTrends = (tasks = [], todayKey, weekStart) => {
  const list = Array.isArray(tasks) ? tasks : [];
  const thisWeekStart =
    weekStart ||
    (() => {
      const [y, m, d] = String(todayKey).split('-').map(Number);
      const date = new Date(y, m - 1, d);
      const dow = date.getDay();
      date.setDate(date.getDate() - dow);
      return toDateKeyFromValue(date);
    })();
  const lastWeekStart = shiftDateKeyBy(thisWeekStart, -7);

  const current = calculatePlanningWeeklyStats(thisWeekStart, list);
  const previous = calculatePlanningWeeklyStats(lastWeekStart, list);

  const delta = (now, then) => {
    if (!previous.hasData) return null;
    return now - then;
  };

  const royalNow = calculateRoyalScore({
    tasks: list,
    todayKey
  });
  // Approximate prior royal using tasks completed/scheduled up to end of last week.
  const lastWeekEnd = shiftDateKeyBy(lastWeekStart, 6);
  const priorTasks = list.filter((task) => {
    const keys = [task?.date, getOriginalDate(task), toDateKeyFromValue(task?.completedAt)].filter(
      Boolean
    );
    return keys.some((key) => key <= lastWeekEnd);
  });
  const royalThen = previous.hasData
    ? calculateRoyalScore({ tasks: priorTasks, todayKey: lastWeekEnd })
    : null;

  return {
    current,
    previous,
    insufficientHistory: !previous.hasData,
    completionRate: {
      current: current.completionRate,
      previous: previous.hasData ? previous.completionRate : null,
      delta: delta(current.completionRate, previous.completionRate)
    },
    xp: {
      current: current.xp,
      previous: previous.hasData ? previous.xp : null,
      delta: delta(current.xp, previous.xp)
    },
    planned: {
      current: current.planned,
      previous: previous.hasData ? previous.planned : null,
      delta: delta(current.planned, previous.planned)
    },
    royalScore: {
      current: royalNow.score,
      previous: royalThen ? royalThen.score : null,
      delta: royalThen ? royalNow.score - royalThen.score : null
    }
  };
};

/**
 * Rollover pattern analysis from real originalDate / rolledFromDate data.
 */
export const analyzeRollovers = (tasks = [], { weekStart } = {}) => {
  const list = Array.isArray(tasks) ? tasks : [];
  const weekKeys = weekStart ? new Set(workWeekDateKeys(weekStart)) : null;

  const rolled = list.filter((task) => {
    const original = getOriginalDate(task);
    const current = DATE_RE.test(String(task?.date || '')) ? task.date : '';
    if (!original || !current || original === current) return false;
    if (String(task?.status || '') === 'cancelled') return false;
    if (weekKeys && !weekKeys.has(original)) return false;
    return true;
  });

  const withExplicitTrail = rolled.filter((task) =>
    DATE_RE.test(String(task?.rolledFromDate || ''))
  );

  const byTag = new Map();
  rolled.forEach((task) => {
    const tag = String(task?.tag || '').trim() || 'Untagged';
    byTag.set(tag, (byTag.get(tag) || 0) + 1);
  });
  const topTag = [...byTag.entries()].sort((a, b) => b[1] - a[1])[0] || null;

  // Afternoon postponement signal: use startTime when present (not invented).
  let after4 = 0;
  let withStart = 0;
  rolled.forEach((task) => {
    const start = String(task?.startTime || '');
    if (!/^\d{1,2}:\d{2}$/.test(start)) return;
    withStart += 1;
    const hour = Number(start.split(':')[0]);
    if (hour >= 16) after4 += 1;
  });

  const insights = [];
  if (topTag && topTag[0] !== 'Untagged' && topTag[1] >= 2) {
    insights.push({
      id: 'rollover-tag',
      text: `You have rolled over ${topTag[1]} ${topTag[0]} task${topTag[1] === 1 ? '' : 's'}${
        weekStart ? ' this week' : ''
      }.`
    });
  }
  if (withStart >= 3 && after4 / withStart >= 0.5) {
    insights.push({
      id: 'rollover-afternoon',
      text: 'Most postponed tasks occur after 4 PM.'
    });
  }

  return {
    count: rolled.length,
    withExplicitTrail: withExplicitTrail.length,
    legacyInferred: rolled.length - withExplicitTrail.length,
    topTag: topTag ? { tag: topTag[0], count: topTag[1] } : null,
    insights,
    hasData: rolled.length > 0,
    limitation:
      rolled.length > withExplicitTrail.length
        ? 'Some rollovers are inferred from original vs current date. Full multi-hop history is not available for older tasks.'
        : null
  };
};

const MIN_INSIGHT_DAYS = 3;
const MIN_INSIGHT_COMPLETIONS = 5;

/**
 * Rules-based insights. Only emits claims supported by enough real data.
 */
export const generateProductivityInsights = (data = {}) => {
  const tasks = data.tasks || [];
  const analytics = data.analytics || buildProductivityAnalytics({ tasks, todayKey: data.todayKey });
  const trends = data.trends || calculateProductivityTrends(tasks, data.todayKey, data.weekStart);
  const rollovers = data.rollovers || analyzeRollovers(tasks, { weekStart: data.weekStart });
  const insights = [];

  const completedWithStamp = tasks.filter(
    (task) => String(task?.status || '') === 'completed' && task?.completedAt
  );

  if (completedWithStamp.length >= MIN_INSIGHT_COMPLETIONS) {
    let beforeNoon = 0;
    completedWithStamp.forEach((task) => {
      const hour = new Date(task.completedAt).getHours();
      if (!Number.isNaN(hour) && hour < 12) beforeNoon += 1;
    });
    const ratio = beforeNoon / completedWithStamp.length;
    if (ratio >= 0.55) {
      insights.push({
        id: 'morning-executor',
        text: 'You complete more tasks before noon.'
      });
    } else if (ratio <= 0.35) {
      insights.push({
        id: 'afternoon-executor',
        text: 'More of your completions happen after noon.'
      });
    }
  }

  if (analytics.mostPostponedCategory && analytics.mostPostponedCategory.count >= 2) {
    insights.push({
      id: 'postpone-category',
      text: `You postpone ${analytics.mostPostponedCategory.tag} tasks more frequently.`
    });
  }

  if (analytics.mostProductiveDay && analytics.dayCount >= MIN_INSIGHT_DAYS) {
    insights.push({
      id: 'strongest-day',
      text: `${analytics.mostProductiveDay.label} is currently your strongest execution day.`
    });
  }

  if (
    !trends.insufficientHistory &&
    trends.completionRate.delta != null &&
    trends.completionRate.delta >= 5 &&
    trends.current.planned >= 3
  ) {
    insights.push({
      id: 'completion-up',
      text: 'Your completion rate improved this week.'
    });
  } else if (
    !trends.insufficientHistory &&
    trends.completionRate.delta != null &&
    trends.completionRate.delta <= -5 &&
    trends.previous.planned >= 3
  ) {
    insights.push({
      id: 'completion-down',
      text: 'Your completion rate dipped this week compared to last week.'
    });
  }

  if (
    analytics.priorityCompletionRate != null &&
    analytics.completionRate != null &&
    analytics.planned >= MIN_INSIGHT_COMPLETIONS
  ) {
    const criticalPlanned = tasks.filter(
      (task) =>
        String(task?.priority || '').toUpperCase() === 'CRITICAL' &&
        String(task?.status || '') !== 'cancelled'
    );
    const criticalCompleted = criticalPlanned.filter(isCompleted);
    if (criticalPlanned.length >= 3) {
      const criticalRate = Math.round((criticalCompleted.length / criticalPlanned.length) * 100);
      if (criticalRate + 10 < analytics.completionRate) {
        insights.push({
          id: 'critical-lag',
          text: 'Critical tasks have a lower completion rate than normal tasks.'
        });
      }
    }
  }

  rollovers.insights.forEach((item) => {
    if (!insights.some((row) => row.id === item.id)) insights.push(item);
  });

  if (analytics.focusHours >= 5) {
    insights.push({
      id: 'focus-depth',
      text: `You've logged ${analytics.focusHours} hours of focus time — depth is compounding.`
    });
  }

  return {
    insights: insights.slice(0, 6),
    insufficientData: insights.length === 0,
    message:
      insights.length === 0
        ? 'Keep executing. Insights appear once there is enough real history to support them.'
        : null
  };
};

/**
 * Compact timeline for a task — only real timestamps / schedule fields.
 */
export const buildTaskHistoryTimeline = (task) => {
  if (!task) return [];
  const events = [];

  if (task.createdAt) {
    events.push({ id: 'created', label: 'Created', at: task.createdAt });
  }

  const original = getOriginalDate(task);
  if (original) {
    events.push({
      id: 'scheduled',
      label: 'Scheduled',
      at: original,
      detail: original
    });
  }

  const status = String(task?.status || '');

  if (DATE_RE.test(String(task?.rolledFromDate || ''))) {
    events.push({
      id: 'rolled',
      label: 'Rolled over',
      at: task.updatedAt || task.rolledFromDate,
      detail: `${task.rolledFromDate} → ${task.date}`
    });
  } else if (
    original &&
    DATE_RE.test(String(task?.date || '')) &&
    task.date !== original
  ) {
    events.push({
      id: 'rolled-inferred',
      label: 'Moved',
      at: task.updatedAt || task.date,
      detail: `Originally ${original}, now ${task.date}`
    });
  }

  if (task.completedAt || status === 'completed') {
    events.push({
      id: 'completed',
      label: 'Completed',
      at: task.completedAt || task.date || null
    });
  }

  if (task.cancelledAt || status === 'cancelled') {
    events.push({
      id: 'cancelled',
      label: 'Cancelled',
      at: task.cancelledAt || null
    });
  }

  return events;
};

/**
 * Unified search across tasks, projects, achievements, and victory entries.
 */
export const searchWorkboardItems = ({
  query = '',
  tasks = [],
  projects = [],
  achievements = [],
  victories = []
} = {}) => {
  const q = String(query || '').trim().toLowerCase();
  if (!q) {
    return { tasks: [], projects: [], achievements: [], victories: [], total: 0 };
  }

  const match = (...parts) =>
    parts.some((part) => String(part || '').toLowerCase().includes(q));

  const taskHits = (tasks || [])
    .filter((task) => match(task.title, task.description, task.tag, task.assignedBy))
    .slice(0, 12)
    .map((task) => ({ type: 'task', id: task._id || task.id, title: task.title, meta: task.date, raw: task }));

  const projectHits = (projects || [])
    .filter((project) => match(project.title, project.description))
    .slice(0, 8)
    .map((project) => ({
      type: 'project',
      id: project._id || project.id,
      title: project.title,
      meta: project.status,
      raw: project
    }));

  const achievementHits = mergeAchievementList(achievements)
    .filter((item) => match(item.title, item.description) && item.unlocked)
    .slice(0, 8)
    .map((item) => ({
      type: 'achievement',
      id: item.id,
      title: item.title,
      meta: item.unlockedAt ? 'Unlocked' : 'Locked',
      raw: item
    }));

  const victoryHits = (victories || [])
    .filter((entry) => match(entry.winText, entry.date))
    .slice(0, 8)
    .map((entry) => ({
      type: 'victory',
      id: entry._id || entry.id || entry.date,
      title: entry.winText,
      meta: entry.date,
      raw: entry
    }));

  const results = { tasks: taskHits, projects: projectHits, achievements: achievementHits, victories: victoryHits };
  results.total =
    taskHits.length + projectHits.length + achievementHits.length + victoryHits.length;
  return results;
};