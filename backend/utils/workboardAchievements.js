/**
 * Workboard achievements — evaluated from real task / XP / focus data.
 * Keys are stable IDs persisted on User.workboardAchievements.
 */

const { calculateDayPlanningStats } = require('./workboardPlanning');

const XP_PER_LEVEL = 500;

const ACHIEVEMENT_DEFS = [
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

const calculateLevel = (totalXP) => {
  const xp = Math.max(0, Number(totalXP) || 0);
  return Math.floor(xp / XP_PER_LEVEL) + 1;
};

const isCompleted = (task) => String(task?.status || '') === 'completed';
const isPlanned = (task) => {
  const status = String(task?.status || '');
  return status !== 'postponed' && status !== 'cancelled';
};
const isCritical = (task) => String(task?.priority || '').toUpperCase() === 'CRITICAL';

const pad = (value) => String(value).padStart(2, '0');

const toDateKey = (date) => {
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  return `${year}-${month}-${day}`;
};

const parseDateKey = (dateKey) => {
  const [year, month, day] = String(dateKey).split('-').map(Number);
  return new Date(year, month - 1, day);
};

const addDays = (dateKey, amount) => {
  const date = parseDateKey(dateKey);
  date.setDate(date.getDate() + amount);
  return toDateKey(date);
};

const startOfWeek = (dateKey) => {
  const date = parseDateKey(dateKey);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  return toDateKey(date);
};

const weekdayKeysDescending = (fromDateKey, count) => {
  const keys = [];
  const cursor = parseDateKey(fromDateKey);
  while (keys.length < count) {
    const dow = cursor.getDay();
    if (dow >= 1 && dow <= 5) {
      keys.push(toDateKey(cursor));
    }
    cursor.setDate(cursor.getDate() - 1);
  }
  return keys;
};

const PRODUCTIVE_DAY_THRESHOLD = 0.7;

const isProductiveDay = (dateKey, tasks) => {
  const dayTasks = (tasks || []).filter((task) => task?.date === dateKey && isPlanned(task));
  if (dayTasks.length === 0) return false;
  const completed = dayTasks.filter(isCompleted).length;
  return completed / dayTasks.length >= PRODUCTIVE_DAY_THRESHOLD;
};

const calculateCurrentStreak = (tasks = [], todayKey = toDateKey(new Date())) => {
  const lookback = weekdayKeysDescending(todayKey, 120);
  let streak = 0;
  for (const dateKey of lookback) {
    const plannedCount = (tasks || []).filter(
      (task) => task?.date === dateKey && isPlanned(task)
    ).length;
    if (plannedCount === 0) {
      if (streak === 0 && dateKey === todayKey) continue;
      break;
    }
    if (isProductiveDay(dateKey, tasks)) streak += 1;
    else break;
  }
  return streak;
};

const groupByDate = (tasks) => {
  const map = new Map();
  (tasks || []).forEach((task) => {
    if (!task?.date) return;
    if (!map.has(task.date)) map.set(task.date, []);
    map.get(task.date).push(task);
  });
  return map;
};

const collectPlanDays = (tasks = []) => {
  const days = new Set();
  (tasks || []).forEach((task) => {
    const original = task?.originalDate || task?.date;
    if (original) days.add(original);
  });
  return [...days];
};

/**
 * @param {{ tasks: Array, totalXp: number, currentStreak?: number, todayKey?: string }} ctx
 * @returns {string[]} achievement ids currently earned
 */
const evaluateEarnedAchievementIds = (ctx = {}) => {
  const tasks = ctx.tasks || [];
  const totalXp = Number(ctx.totalXp) || 0;
  const todayKey = ctx.todayKey || toDateKey(new Date());
  const streak =
    typeof ctx.currentStreak === 'number'
      ? ctx.currentStreak
      : calculateCurrentStreak(tasks, todayKey);

  const earned = new Set();
  const completedAll = tasks.filter(isCompleted);
  const byDate = groupByDate(tasks);

  if (completedAll.length >= 1) earned.add('first_step');

  for (const [, dayTasks] of byDate) {
    const completed = dayTasks.filter(isCompleted).length;
    if (completed >= 5) earned.add('execution_mode');
  }

  // Overachiever: completions on a calendar day exceed tasks originally planned for that day.
  for (const planDay of collectPlanDays(tasks)) {
    const stats = calculateDayPlanningStats(planDay, tasks);
    if (stats.overachieved) {
      earned.add('overachiever');
      break;
    }
  }

  if (streak >= 3) earned.add('consistent');
  if (streak >= 7) earned.add('on_fire');

  const weekStart = startOfWeek(todayKey);
  for (let offset = 0; offset < 16; offset += 1) {
    const ws = addDays(weekStart, -offset * 7);
    const weekDates = new Set([0, 1, 2, 3, 4].map((i) => addDays(ws, i)));
    const weekCritical = tasks.filter((t) => weekDates.has(t.date) && isCritical(t));
    if (weekCritical.length === 0) continue;
    if (weekCritical.every(isCompleted)) {
      earned.add('perfect_week');
      break;
    }
  }

  const totalFocusSeconds = tasks.reduce(
    (sum, task) => sum + (Number(task.focusTime) || 0),
    0
  );
  if (totalFocusSeconds >= 10 * 60 * 60) earned.add('deep_worker');

  const level = calculateLevel(totalXp);
  if (level >= 10) earned.add('royalty');
  if (level >= 25) earned.add('legend');

  return [...earned];
};

const syncUserAchievements = async (user, ctx) => {
  if (!user) return { achievements: [], newlyUnlocked: [] };

  const earnedIds = evaluateEarnedAchievementIds(ctx);
  const existing = Array.isArray(user.workboardAchievements)
    ? user.workboardAchievements
    : [];
  const existingKeys = new Set(existing.map((row) => row.id));
  const newlyUnlocked = [];

  earnedIds.forEach((id) => {
    if (existingKeys.has(id)) return;
    const def = ACHIEVEMENT_DEFS.find((item) => item.id === id);
    if (!def) return;
    const entry = { id, unlockedAt: new Date() };
    existing.push(entry);
    newlyUnlocked.push({
      id: def.id,
      title: def.title,
      description: def.description,
      unlockedAt: entry.unlockedAt
    });
  });

  if (newlyUnlocked.length > 0) {
    user.workboardAchievements = existing;
    user.markModified('workboardAchievements');
    await user.save();
  }

  return {
    achievements: existing,
    newlyUnlocked
  };
};

const listAchievementsForUser = (userAchievements = []) => {
  const unlockedMap = new Map(
    (userAchievements || []).map((row) => [row.id, row.unlockedAt])
  );

  return ACHIEVEMENT_DEFS.map((def) => ({
    id: def.id,
    title: def.title,
    description: def.description,
    unlocked: unlockedMap.has(def.id),
    unlockedAt: unlockedMap.get(def.id) || null
  }));
};

module.exports = {
  ACHIEVEMENT_DEFS,
  XP_PER_LEVEL,
  calculateLevel,
  calculateCurrentStreak,
  evaluateEarnedAchievementIds,
  syncUserAchievements,
  listAchievementsForUser,
  toDateKey
};
