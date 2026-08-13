/**
 * Workboard XP award helpers.
 * Keep XP numbers configurable here — do not hard-code across controllers.
 */

const XP_BY_PRIORITY = {
  LOW: 10,
  NORMAL: 25,
  HIGH: 50,
  CRITICAL: 100
};

const PRIORITIES = Object.keys(XP_BY_PRIORITY);
const DEFAULT_PRIORITY = 'NORMAL';

const normalizePriority = (priority) => {
  const key = String(priority || DEFAULT_PRIORITY).toUpperCase();
  return PRIORITIES.includes(key) ? key : DEFAULT_PRIORITY;
};

/**
 * @param {{ priority?: string }} task
 * @returns {number}
 */
const calculateTaskXP = (task) => {
  const priority = normalizePriority(task?.priority);
  return XP_BY_PRIORITY[priority] ?? XP_BY_PRIORITY[DEFAULT_PRIORITY];
};

/**
 * Apply XP when a task enters or leaves completed.
 * Uses task.xpAwarded as the idempotency lock so toggles never double-pay.
 *
 * @param {import('mongoose').Document} task  WorkboardTask document (mutated)
 * @param {string} previousStatus
 * @param {string} nextStatus
 * @returns {{ xpDelta: number, awarded: number, clawedBack: number }}
 */
const applyCompletionXp = (task, previousStatus, nextStatus) => {
  const wasCompleted = previousStatus === 'completed';
  const isCompleted = nextStatus === 'completed';
  const alreadyAwarded = Number(task.xpAwarded) || 0;

  if (!wasCompleted && isCompleted) {
    if (alreadyAwarded > 0) {
      return { xpDelta: 0, awarded: 0, clawedBack: 0 };
    }
    const xp = calculateTaskXP(task);
    task.xpAwarded = xp;
    task.completedAt = new Date();
    return { xpDelta: xp, awarded: xp, clawedBack: 0 };
  }

  if (wasCompleted && !isCompleted) {
    if (alreadyAwarded <= 0) {
      task.xpAwarded = 0;
      task.completedAt = null;
      return { xpDelta: 0, awarded: 0, clawedBack: 0 };
    }
    task.xpAwarded = 0;
    task.completedAt = null;
    return { xpDelta: -alreadyAwarded, awarded: 0, clawedBack: alreadyAwarded };
  }

  return { xpDelta: 0, awarded: 0, clawedBack: 0 };
};

module.exports = {
  XP_BY_PRIORITY,
  PRIORITIES,
  DEFAULT_PRIORITY,
  normalizePriority,
  calculateTaskXP,
  applyCompletionXp
};
