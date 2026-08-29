/**
 * Visit-based taskboard streak — persisted on User, independent of task completion.
 */

const STREAK_RESTORE_XP_COST = 50;
const STREAK_RESTORE_MONTHLY_LIMIT = 5;

const pad = (value) => String(value).padStart(2, '0');

const toDateKey = (date = new Date()) => {
  const cursor = date instanceof Date ? date : new Date(date);
  return `${cursor.getFullYear()}-${pad(cursor.getMonth() + 1)}-${pad(cursor.getDate())}`;
};

const parseDateKey = (dateKey) => {
  const [year, month, day] = String(dateKey).split('-').map(Number);
  return new Date(year, month - 1, day);
};

const addDays = (dateKey, amount) => {
  const cursor = parseDateKey(dateKey);
  cursor.setDate(cursor.getDate() + amount);
  return toDateKey(cursor);
};

const monthKeyFromDateKey = (dateKey) => String(dateKey).slice(0, 7);

const getRestoresUsedThisMonth = (user, todayKey) => {
  const monthKey = monthKeyFromDateKey(todayKey);
  if (user.workboardStreakRestoreMonth !== monthKey) return 0;
  return Math.max(0, Number(user.workboardStreakRestoreCount) || 0);
};

const getRestoresRemaining = (user, todayKey) =>
  Math.max(0, STREAK_RESTORE_MONTHLY_LIMIT - getRestoresUsedThisMonth(user, todayKey));

const buildStreakPayload = (user, todayKey = toDateKey()) => {
  if (!user) {
    return {
      current: 0,
      longest: 0,
      streakBeforeBreak: 0,
      canRestore: false,
      restoreXpCost: STREAK_RESTORE_XP_COST,
      restoresRemainingThisMonth: STREAK_RESTORE_MONTHLY_LIMIT,
      restoreMonthlyLimit: STREAK_RESTORE_MONTHLY_LIMIT,
      lastVisitDate: null
    };
  }

  const current = Math.max(0, Number(user.workboardVisitStreak) || 0);
  const streakBeforeBreak = Math.max(0, Number(user.workboardStreakBeforeBreak) || 0);
  const longest = Math.max(current, Number(user.workboardLongestStreak) || 0);
  const restoresRemaining = getRestoresRemaining(user, todayKey);
  const totalXp = Math.max(0, Number(user.workboardXp) || 0);

  const canRestore =
    streakBeforeBreak > 1 &&
    current < streakBeforeBreak &&
    restoresRemaining > 0 &&
    totalXp >= STREAK_RESTORE_XP_COST;

  return {
    current,
    longest,
    streakBeforeBreak,
    canRestore,
    restoreXpCost: STREAK_RESTORE_XP_COST,
    restoresRemainingThisMonth: restoresRemaining,
    restoreMonthlyLimit: STREAK_RESTORE_MONTHLY_LIMIT,
    lastVisitDate: user.workboardLastVisitDate || null
  };
};

/**
 * Record today's visit and update streak counters.
 * First visit ever → day 1. Return after a gap → day 1. Consecutive day → +1.
 *
 * @param {import('../models/User')} user Mongoose user document (mutated)
 * @param {string} [todayKey]
 * @returns {Promise<{ changed: boolean, streak: ReturnType<typeof buildStreakPayload> }>}
 */
const recordVisit = async (user, todayKey = toDateKey()) => {
  if (!user) {
    return { changed: false, streak: buildStreakPayload(null, todayKey) };
  }

  const lastVisit = user.workboardLastVisitDate;
  let streak = Math.max(0, Number(user.workboardVisitStreak) || 0);
  let changed = false;

  if (!lastVisit) {
    streak = 1;
    user.workboardLastVisitDate = todayKey;
    user.workboardVisitStreak = streak;
    changed = true;
  } else if (lastVisit === todayKey) {
    if (streak < 1) {
      streak = 1;
      user.workboardVisitStreak = streak;
      changed = true;
    }
  } else {
    const yesterday = addDays(todayKey, -1);
    user.workboardLastVisitDate = todayKey;
    changed = true;

    if (lastVisit === yesterday) {
      streak = Math.max(streak, 1) + 1;
    } else {
      if (streak > 1) {
        user.workboardStreakBeforeBreak = streak;
      }
      streak = 1;
    }

    user.workboardVisitStreak = streak;
  }

  if (changed) {
    const longest = Math.max(Number(user.workboardLongestStreak) || 0, streak);
    user.workboardLongestStreak = longest;
    await user.save();
  }

  return { changed, streak: buildStreakPayload(user, todayKey) };
};

/**
 * Spend XP to restore a broken streak to its pre-break value.
 *
 * @param {import('../models/User')} user
 * @param {string} [todayKey]
 */
const restoreStreak = async (user, todayKey = toDateKey()) => {
  if (!user) {
    return { ok: false, message: 'User not found.' };
  }

  const streakBeforeBreak = Math.max(0, Number(user.workboardStreakBeforeBreak) || 0);
  const currentStreak = Math.max(0, Number(user.workboardVisitStreak) || 0);

  if (streakBeforeBreak <= 1) {
    return { ok: false, message: 'No streak available to restore.' };
  }

  if (currentStreak >= streakBeforeBreak) {
    return { ok: false, message: 'Your streak is already at or above the restorable amount.' };
  }

  const restoresRemaining = getRestoresRemaining(user, todayKey);
  if (restoresRemaining <= 0) {
    return {
      ok: false,
      message: `You can only restore a streak ${STREAK_RESTORE_MONTHLY_LIMIT} times per month.`
    };
  }

  const totalXp = Math.max(0, Number(user.workboardXp) || 0);
  if (totalXp < STREAK_RESTORE_XP_COST) {
    return {
      ok: false,
      message: `You need ${STREAK_RESTORE_XP_COST} XP to restore your streak.`
    };
  }

  const monthKey = monthKeyFromDateKey(todayKey);
  if (user.workboardStreakRestoreMonth !== monthKey) {
    user.workboardStreakRestoreMonth = monthKey;
    user.workboardStreakRestoreCount = 0;
  }

  user.workboardXp = totalXp - STREAK_RESTORE_XP_COST;
  user.workboardVisitStreak = streakBeforeBreak;
  user.workboardStreakBeforeBreak = 0;
  user.workboardStreakRestoreCount = getRestoresUsedThisMonth(user, todayKey) + 1;
  user.workboardStreakRestoreMonth = monthKey;

  const longest = Math.max(Number(user.workboardLongestStreak) || 0, streakBeforeBreak);
  user.workboardLongestStreak = longest;

  await user.save();

  return {
    ok: true,
    streak: buildStreakPayload(user, todayKey),
    totalXp: user.workboardXp
  };
};

module.exports = {
  STREAK_RESTORE_XP_COST,
  STREAK_RESTORE_MONTHLY_LIMIT,
  toDateKey,
  buildStreakPayload,
  recordVisit,
  restoreStreak
};
