const crypto = require('crypto');
const { Document, Packer, Paragraph, TextRun, HeadingLevel } = require('docx');
const WorkboardTask = require('../models/WorkboardTask');
const WorkboardPresence = require('../models/WorkboardPresence');
const WorkboardShare = require('../models/WorkboardShare');
const WorkboardTag = require('../models/WorkboardTag');
const User = require('../models/User');
const { canEditWorkboard, optionalAuthenticateToken } = require('../middleware/auth');
const {
  PRIORITIES,
  DEFAULT_PRIORITY,
  normalizePriority,
  applyCompletionXp
} = require('../utils/workboardXp');
const { calculateLevel } = require('../utils/workboardAchievements');
const {
  buildStreakPayload,
  recordVisit,
  restoreStreak,
  toDateKey: streakToDateKey
} = require('../utils/workboardStreak');
const { runAchievementSync } = require('./workboardExecutionController');
const { buildShareAccessPayload } = require('./workboardAccessController');
const {
  hasWorkboardPermission,
  getPermissionsForUser,
  canCollaborateOnBoard
} = require('../utils/workboardAccess');
const mongoose = require('mongoose');

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const TASKBOARD_SHARE_PATH_PREFIX = '/taskboard/share';
const STATUSES = ['started', 'in_progress', 'almost_done', 'completed', 'postponed', 'cancelled'];
const LEGACY_STATUS_MAP = {
  todo: 'started',
  blocked: 'postponed'
};
const ONLINE_THRESHOLD_MS = 45 * 1000;
const TAG_MAX_LENGTH = 40;
const GAMIFICATION_LOOKBACK_DAYS = 120;

const adjustUserWorkboardXp = async (userId, xpDelta) => {
  if (!xpDelta) {
    const user = await User.findById(userId).select('workboardXp');
    return user?.workboardXp || 0;
  }

  const user = await User.findById(userId).select('workboardXp');
  if (!user) return 0;

  const next = Math.max(0, (user.workboardXp || 0) + xpDelta);
  user.workboardXp = next;
  await user.save();
  return next;
};

const normalizeTagName = (value) =>
  String(value || '')
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, TAG_MAX_LENGTH);

const listTagNames = async (ownerId) => {
  const [saved, used] = await Promise.all([
    WorkboardTag.find({ owner: ownerId }).sort({ nameKey: 1 }).lean(),
    WorkboardTask.distinct('tag', { owner: ownerId, tag: { $nin: [null, ''] } })
  ]);
  const names = new Set([
    ...saved.map((tag) => tag.name),
    ...used.map((tag) => String(tag || '').trim()).filter(Boolean)
  ]);
  return [...names].sort((a, b) => a.localeCompare(b));
};

const upsertTag = async (ownerId, value) => {
  const name = normalizeTagName(value);
  if (!name) return '';

  const nameKey = name.toLowerCase();
  const existing = await WorkboardTag.findOne({ owner: ownerId, nameKey });
  if (existing) return existing.name;

  try {
    const created = await WorkboardTag.create({ owner: ownerId, name, nameKey });
    return created.name;
  } catch (error) {
    if (error.code === 11000) {
      const raced = await WorkboardTag.findOne({ owner: ownerId, nameKey });
      return raced?.name || name;
    }
    throw error;
  }
};

const normalizeTaskStatus = (status) => {
  if (!status) return 'started';
  return LEGACY_STATUS_MAP[status] || status;
};

const pad = (value) => String(value).padStart(2, '0');

const toDateKey = (date) => {
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  return `${year}-${month}-${day}`;
};

const parseDateKey = (dateKey) => {
  const [year, month, day] = dateKey.split('-').map(Number);
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
  date.setDate(date.getDate() - day);
  return toDateKey(date);
};

/** Workboard weeks are Sun–Sat (matches Week 1–4 UI). */
const endOfWeek = (dateKey) => addDays(startOfWeek(dateKey), 6);

const startOfMonth = (dateKey) => {
  const date = parseDateKey(dateKey);
  date.setDate(1);
  return toDateKey(date);
};

const endOfMonth = (dateKey) => {
  const date = parseDateKey(dateKey);
  date.setMonth(date.getMonth() + 1, 0);
  return toDateKey(date);
};

const getRangeForPeriod = (period, dateKey) => {
  if (period === 'week') {
    return { startDate: startOfWeek(dateKey), endDate: endOfWeek(dateKey) };
  }
  if (period === 'month') {
    return { startDate: startOfMonth(dateKey), endDate: endOfMonth(dateKey) };
  }
  return { startDate: dateKey, endDate: dateKey };
};

const buildTaskboardShareUrl = (req, token) => {
  const frontend = (process.env.FRONTEND_URL || '').replace(/\/$/, '');
  const path = `${TASKBOARD_SHARE_PATH_PREFIX}/${token}`;
  if (frontend) return `${frontend}${path}`;
  return `${req.protocol}://${req.get('host')}${path}`;
};

const STATUS_LABELS = {
  started: 'Started',
  in_progress: 'In progress',
  almost_done: 'Almost done',
  completed: 'Completed',
  postponed: 'Postponed'
};

const PERIOD_TITLES = {
  day: 'Daily',
  week: 'Weekly',
  month: 'Monthly'
};

const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const formatTime12h = (hhmm) => {
  if (!hhmm || !TIME_RE.test(hhmm)) return '';
  const [hourStr, minuteStr] = hhmm.split(':');
  let hour = Number(hourStr);
  const minutes = Number(minuteStr);
  const period = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  if (hour === 0) hour = 12;
  if (minutes === 0) return `${hour} ${period}`;
  return `${hour}:${pad(minutes)} ${period}`;
};

const formatTimeRange12h = (startTime, endTime) => {
  if (!startTime) return '';
  const startLabel = formatTime12h(startTime);
  if (!startLabel) return '';
  if (!endTime) return startLabel;
  const endLabel = formatTime12h(endTime);
  return endLabel ? `${startLabel} – ${endLabel}` : startLabel;
};

const formatDisplayDate = (dateKey) => {
  const date = parseDateKey(dateKey);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

const formatDisplayMonth = (dateKey) => {
  const date = parseDateKey(dateKey);
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric'
  }).format(date);
};

const formatRangeLabel = (period, startDate, endDate) => {
  if (period === 'day') return formatDisplayDate(startDate);
  if (period === 'month') return formatDisplayMonth(startDate);
  if (startDate === endDate) return formatDisplayDate(startDate);
  const start = parseDateKey(startDate);
  const end = parseDateKey(endDate);
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(start);
    return `${month} ${start.getDate()}–${end.getDate()}, ${start.getFullYear()}`;
  }
  return `${formatDisplayDate(startDate)} – ${formatDisplayDate(endDate)}`;
};

const buildDocxFilename = (period, startDate, endDate) => {
  if (period === 'day') return `taskboard-daily-${startDate}.docx`;
  if (period === 'week') return `taskboard-weekly-${startDate}-to-${endDate}.docx`;
  return `taskboard-monthly-${startDate.slice(0, 7)}.docx`;
};

const summarizeTasks = (tasks) => {
  const summary = {
    total: tasks.length,
    started: 0,
    in_progress: 0,
    almost_done: 0,
    completed: 0,
    postponed: 0,
    cancelled: 0
  };

  tasks.forEach((task) => {
    const status = normalizeTaskStatus(task.status);
    if (summary[status] !== undefined) {
      summary[status] += 1;
    }
  });

  return summary;
};

const buildReportMarkdown = ({ ownerName, period, startDate, endDate, tasks, summary }) => {
  const lines = [
    `# Taskboard Report`,
    ``,
    `**Worker:** ${ownerName}`,
    `**Period:** ${period}`,
    `**Range:** ${startDate} → ${endDate}`,
    ``,
    `## Summary`,
    `- Total: ${summary.total}`,
    `- Completed: ${summary.completed}`,
    `- Almost done: ${summary.almost_done}`,
    `- In progress: ${summary.in_progress}`,
    `- Started: ${summary.started}`,
    `- Postponed: ${summary.postponed}`,
    `- Cancelled: ${summary.cancelled || 0}`,
    ``,
    `## Tasks`
  ];

  if (tasks.length === 0) {
    lines.push('', '_No tasks in this period._');
  } else {
    tasks.forEach((task) => {
      const timeLabel = task.startTime
        ? `${task.startTime}${task.endTime ? `–${task.endTime}` : ''}`
        : 'unscheduled';
      lines.push(
        '',
        `### ${task.title}`,
        `- Date: ${task.date}`,
        `- Time: ${timeLabel}`,
        `- Status: ${task.status}`
      );
      if (task.tag) {
        lines.push(`- Tag: ${task.tag}`);
      }
      if (task.description) {
        lines.push(`- Notes: ${task.description}`);
      }
      if (task.comments?.length) {
        lines.push('- Comments:');
        task.comments.slice(-5).forEach((comment) => {
          lines.push(`  - ${comment.authorName}: ${comment.body}`);
        });
      }
    });
  }

  return lines.join('\n');
};

const resolveOwnerId = async (req) => {
  const requestedOwnerId = req.query.ownerId || req.body.ownerId;

  if (req.user.role === 'superior') {
    if (!requestedOwnerId) {
      const firstAdmin = await User.findOne({ role: 'admin', isActive: true }).select('_id');
      return firstAdmin?._id?.toString() || null;
    }
    const owner = await User.findById(requestedOwnerId).select('role isActive');
    if (!owner || owner.role !== 'admin' || !owner.isActive) {
      return null;
    }
    return owner._id.toString();
  }

  if (requestedOwnerId && requestedOwnerId !== req.user._id.toString()) {
    const canCollaborate = await canCollaborateOnBoard(
      requestedOwnerId,
      req.user._id.toString()
    );
    if (canCollaborate) {
      return requestedOwnerId;
    }
    if (req.user.role !== 'admin') {
      return null;
    }
    const owner = await User.findById(requestedOwnerId).select('role isActive');
    if (!owner || owner.role !== 'admin' || !owner.isActive) {
      return null;
    }
    return owner._id.toString();
  }

  return req.user._id.toString();
};

const isPresenceOnline = (presence) => {
  if (!presence || presence.status !== 'online' || !presence.lastSeen) {
    return false;
  }
  return Date.now() - new Date(presence.lastSeen).getTime() <= ONLINE_THRESHOLD_MS;
};

const sortTasks = (tasks) =>
  [...tasks].sort((a, b) => {
    const aTime = a.startTime || '99:99';
    const bTime = b.startTime || '99:99';
    if (aTime !== bTime) return aTime.localeCompare(bTime);
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

const getWorkers = async (req, res) => {
  try {
    const workers = await User.find({ role: 'admin', isActive: true })
      .select('username email role')
      .sort({ username: 1 });

    const workerIds = workers.map((worker) => worker._id);
    const presenceRows = await WorkboardPresence.find({ user: { $in: workerIds } });
    const presenceByUser = new Map(
      presenceRows.map((row) => [row.user.toString(), row])
    );

    res.json({
      workers: workers.map((worker) => {
        const presence = presenceByUser.get(worker._id.toString());
        const online = isPresenceOnline(presence);
        return {
          id: worker._id,
          username: worker.username,
          email: worker.email,
          presence: {
            status: online ? 'online' : 'offline',
            lastSeen: presence?.lastSeen || null
          }
        };
      }),
      canEdit: canEditWorkboard(req.user),
      currentUserId: req.user._id
    });
  } catch (error) {
    console.error('Workboard workers error:', error);
    res.status(500).json({ message: 'Failed to load taskboard workers' });
  }
};

const getTasks = async (req, res) => {
  try {
    const { date, startDate, endDate } = req.query;
    const hasRange = Boolean(startDate || endDate);
    const hasDate = Boolean(date);

    if (hasRange) {
      if (!startDate || !endDate || !DATE_RE.test(startDate) || !DATE_RE.test(endDate)) {
        return res.status(400).json({
          message: 'Valid startDate and endDate (YYYY-MM-DD) are required'
        });
      }
      if (startDate > endDate) {
        return res.status(400).json({ message: 'startDate must be on or before endDate' });
      }
    } else if (!hasDate || !DATE_RE.test(date)) {
      return res.status(400).json({ message: 'Valid date (YYYY-MM-DD) is required' });
    }

    const ownerId = await resolveOwnerId(req);
    if (!ownerId) {
      return res.status(400).json({ message: 'Valid worker ownerId is required' });
    }

    const canEdit =
      canEditWorkboard(req.user) &&
      (ownerId === req.user._id.toString() ||
        (await canCollaborateOnBoard(ownerId, req.user._id)));
    const myPermissions = await getPermissionsForUser(ownerId, req.user._id);

    const presence = await WorkboardPresence.findOne({ user: ownerId });
    const owner = await User.findById(ownerId).select('username email');
    const ownerPayload = owner
      ? { id: owner._id, username: owner.username, email: owner.email }
      : null;
    const presencePayload = {
      status: isPresenceOnline(presence) ? 'online' : 'offline',
      lastSeen: presence?.lastSeen || null
    };

    if (hasRange) {
      const tasks = await WorkboardTask.find({
        owner: ownerId,
        date: { $gte: startDate, $lte: endDate }
      }).lean();

      const normalized = tasks.map((task) => ({
        ...task,
        status: normalizeTaskStatus(task.status)
      }));

      const tasksByDate = {};
      normalized.forEach((task) => {
        if (!tasksByDate[task.date]) tasksByDate[task.date] = [];
        tasksByDate[task.date].push(task);
      });
      Object.keys(tasksByDate).forEach((key) => {
        tasksByDate[key] = sortTasks(tasksByDate[key]);
      });

      const tagNames = await listTagNames(ownerId);

      return res.json({
        startDate,
        endDate,
        owner: ownerPayload,
        canEdit,
        myPermissions,
        presence: presencePayload,
        tasksByDate,
        tasks: sortTasks(normalized),
        tags: tagNames,
        summary: summarizeTasks(normalized)
      });
    }

    const tasks = await WorkboardTask.find({ owner: ownerId, date }).lean();
    const tagNames = await listTagNames(ownerId);

    res.json({
      date,
      owner: ownerPayload,
      canEdit,
      myPermissions,
      presence: presencePayload,
      tasks: sortTasks(tasks).map((task) => ({
        ...task,
        status: normalizeTaskStatus(task.status)
      })),
      tags: tagNames,
      summary: summarizeTasks(tasks)
    });
  } catch (error) {
    console.error('Workboard get tasks error:', error);
    res.status(500).json({ message: 'Failed to load taskboard tasks' });
  }
};

const createTask = async (req, res) => {
  try {
    if (!canEditWorkboard(req.user)) {
      return res.status(403).json({ message: 'Only admins can create workboard tasks' });
    }

    const {
      title,
      description = '',
      date,
      startTime = '',
      endTime = '',
      status = 'started',
      assignedBy = '',
      tag = '',
      priority = DEFAULT_PRIORITY,
      project = null,
      ownerId: requestedOwnerId
    } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }
    if (!date || !DATE_RE.test(date)) {
      return res.status(400).json({ message: 'Valid date (YYYY-MM-DD) is required' });
    }
    if (startTime && !TIME_RE.test(startTime)) {
      return res.status(400).json({ message: 'startTime must be HH:mm' });
    }
    if (endTime && !TIME_RE.test(endTime)) {
      return res.status(400).json({ message: 'endTime must be HH:mm' });
    }
    if (!STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const normalizedPriority = normalizePriority(priority);
    if (priority && !PRIORITIES.includes(String(priority).toUpperCase())) {
      return res.status(400).json({ message: 'Invalid priority' });
    }

    let projectId = null;
    if (project) {
      if (!mongoose.Types.ObjectId.isValid(project)) {
        return res.status(400).json({ message: 'Invalid project' });
      }
      projectId = project;
    }

    const userId = req.user._id.toString();
    let boardOwnerId = userId;
    if (requestedOwnerId && requestedOwnerId !== userId) {
      const canAdd = await hasWorkboardPermission(requestedOwnerId, userId, 'add_task');
      if (!canAdd) {
        return res.status(403).json({ message: 'You do not have permission to add tasks here' });
      }
      boardOwnerId = requestedOwnerId;
    }

    const previousLevel = calculateLevel(
      (await User.findById(boardOwnerId).select('workboardXp'))?.workboardXp || 0
    );

    const savedTag = await upsertTag(boardOwnerId, tag);

    const task = new WorkboardTask({
      owner: boardOwnerId,
      title: title.trim(),
      description: String(description || '').trim(),
      date,
      originalDate: date,
      rolledFromDate: null,
      startTime: startTime || '',
      endTime: endTime || '',
      status,
      assignedBy: String(assignedBy || '').trim(),
      tag: savedTag,
      priority: normalizedPriority,
      project: projectId,
      xpAwarded: 0,
      completedAt: null,
      cancelledAt: status === 'cancelled' ? new Date() : null,
      focusTime: 0
    });

    const xpResult = applyCompletionXp(task, 'started', status);
    await task.save();
    const totalXp = await adjustUserWorkboardXp(boardOwnerId, xpResult.xpDelta);
    const nextLevel = calculateLevel(totalXp);
    const achievementSync = await runAchievementSync(boardOwnerId);

    res.status(201).json({
      task,
      tags: await listTagNames(boardOwnerId),
      xpAwarded: xpResult.awarded,
      xpDelta: xpResult.xpDelta,
      totalXp,
      leveledUp: nextLevel > previousLevel,
      newLevel: nextLevel,
      newlyUnlocked: achievementSync.newlyUnlocked
    });
  } catch (error) {
    console.error('Workboard create task error:', error);
    res.status(500).json({ message: 'Failed to create task' });
  }
};

const updateTask = async (req, res) => {
  try {
    if (!canEditWorkboard(req.user)) {
      return res.status(403).json({ message: 'Only admins can edit workboard tasks' });
    }

    const task = await WorkboardTask.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    const ownerId = task.owner.toString();
    const userId = req.user._id.toString();
    const canEditTask =
      ownerId === userId ||
      (await hasWorkboardPermission(ownerId, userId, 'edit_task'));
    if (!canEditTask) {
      return res.status(403).json({ message: 'You do not have permission to edit this task' });
    }

    const previousStatus = normalizeTaskStatus(task.status);
    const previousLevel = calculateLevel(
      (await User.findById(ownerId).select('workboardXp'))?.workboardXp || 0
    );
    if (!task.originalDate) {
      task.originalDate = task.date;
    }
    const { title, description, date, startTime, endTime, status, assignedBy, tag, priority, project } =
      req.body;

    if (title !== undefined) {
      if (!String(title).trim()) {
        return res.status(400).json({ message: 'Title cannot be empty' });
      }
      task.title = String(title).trim();
    }
    if (description !== undefined) {
      task.description = String(description).trim();
    }
    if (date !== undefined) {
      if (!DATE_RE.test(date)) {
        return res.status(400).json({ message: 'Valid date (YYYY-MM-DD) is required' });
      }
      // Freeze original plan day; record rollover trail when the schedule moves.
      if (!task.originalDate) {
        task.originalDate = task.date;
      }
      if (date !== task.date) {
        task.rolledFromDate = task.date;
        task.date = date;
      }
    }
    if (startTime !== undefined) {
      if (startTime && !TIME_RE.test(startTime)) {
        return res.status(400).json({ message: 'startTime must be HH:mm' });
      }
      task.startTime = startTime || '';
    }
    if (endTime !== undefined) {
      if (endTime && !TIME_RE.test(endTime)) {
        return res.status(400).json({ message: 'endTime must be HH:mm' });
      }
      task.endTime = endTime || '';
    }
    if (priority !== undefined) {
      if (!PRIORITIES.includes(String(priority).toUpperCase())) {
        return res.status(400).json({ message: 'Invalid priority' });
      }
      task.priority = normalizePriority(priority);
    }
    if (project !== undefined) {
      if (project === null || project === '') {
        task.project = null;
      } else if (!mongoose.Types.ObjectId.isValid(project)) {
        return res.status(400).json({ message: 'Invalid project' });
      } else {
        task.project = project;
      }
    }
    if (status !== undefined) {
      if (!STATUSES.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
      task.status = status;
      if (status === 'cancelled') {
        task.cancelledAt = task.cancelledAt || new Date();
      } else if (previousStatus === 'cancelled') {
        task.cancelledAt = null;
      }
    } else {
      task.status = normalizeTaskStatus(task.status);
    }
    if (assignedBy !== undefined) {
      task.assignedBy = String(assignedBy || '').trim();
    }
    if (tag !== undefined) {
      task.tag = await upsertTag(ownerId, tag);
    }

    const nextStatus = normalizeTaskStatus(task.status);
    const xpResult = applyCompletionXp(task, previousStatus, nextStatus);
    await task.save();
    const totalXp = await adjustUserWorkboardXp(ownerId, xpResult.xpDelta);
    const nextLevel = calculateLevel(totalXp);
    const achievementSync = await runAchievementSync(ownerId);

    res.json({
      task,
      tags: await listTagNames(ownerId),
      xpAwarded: xpResult.awarded,
      xpDelta: xpResult.xpDelta,
      totalXp,
      leveledUp: nextLevel > previousLevel,
      newLevel: nextLevel,
      newlyUnlocked: achievementSync.newlyUnlocked
    });
  } catch (error) {
    console.error('Workboard update task error:', error);
    res.status(500).json({ message: 'Failed to update task' });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    if (!canEditWorkboard(req.user)) {
      return res.status(403).json({ message: 'Only admins can update task status' });
    }

    const { status } = req.body;
    if (!STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const task = await WorkboardTask.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    const ownerId = task.owner.toString();
    const userId = req.user._id.toString();
    const canUpdateStatus =
      ownerId === userId ||
      (await hasWorkboardPermission(ownerId, userId, 'update_status')) ||
      (await hasWorkboardPermission(ownerId, userId, 'edit_task'));
    if (!canUpdateStatus) {
      return res.status(403).json({ message: 'You do not have permission to update this task' });
    }

    const previousStatus = normalizeTaskStatus(task.status);
    const previousLevel = calculateLevel(
      (await User.findById(ownerId).select('workboardXp'))?.workboardXp || 0
    );
    if (!task.originalDate) {
      task.originalDate = task.date;
    }
    task.status = status;
    if (status === 'cancelled') {
      task.cancelledAt = task.cancelledAt || new Date();
    } else if (previousStatus === 'cancelled') {
      task.cancelledAt = null;
    }
    const xpResult = applyCompletionXp(task, previousStatus, status);
    await task.save();
    const totalXp = await adjustUserWorkboardXp(ownerId, xpResult.xpDelta);
    const nextLevel = calculateLevel(totalXp);
    const achievementSync = await runAchievementSync(ownerId);

    res.json({
      task: { ...task.toObject(), status: normalizeTaskStatus(task.status) },
      xpAwarded: xpResult.awarded,
      xpDelta: xpResult.xpDelta,
      totalXp,
      leveledUp: nextLevel > previousLevel,
      newLevel: nextLevel,
      newlyUnlocked: achievementSync.newlyUnlocked
    });
  } catch (error) {
    console.error('Workboard status update error:', error);
    res.status(500).json({ message: 'Failed to update status' });
  }
};

const deleteTask = async (req, res) => {
  try {
    if (!canEditWorkboard(req.user)) {
      return res.status(403).json({ message: 'Only admins can delete workboard tasks' });
    }

    const task = await WorkboardTask.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    const ownerId = task.owner.toString();
    const userId = req.user._id.toString();
    const canDelete =
      ownerId === userId ||
      (await hasWorkboardPermission(ownerId, userId, 'delete_task'));
    if (!canDelete) {
      return res.status(403).json({ message: 'You do not have permission to delete this task' });
    }

    const clawback =
      normalizeTaskStatus(task.status) === 'completed' ? Number(task.xpAwarded) || 0 : 0;

    await task.deleteOne();
    const totalXp = await adjustUserWorkboardXp(ownerId, clawback ? -clawback : 0);

    res.json({ message: 'Task deleted', xpDelta: clawback ? -clawback : 0, totalXp });
  } catch (error) {
    console.error('Workboard delete task error:', error);
    res.status(500).json({ message: 'Failed to delete task' });
  }
};

const addComment = async (req, res) => {
  try {
    const { body } = req.body;
    if (!body?.trim()) {
      return res.status(400).json({ message: 'Comment body is required' });
    }

    const task = await WorkboardTask.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const isOwner = task.owner.toString() === req.user._id.toString();
    const isSuperior = req.user.role === 'superior';
    const canComment =
      isOwner ||
      isSuperior ||
      (await hasWorkboardPermission(task.owner.toString(), req.user._id.toString(), 'add_comment'));
    if (!canComment) {
      return res.status(403).json({ message: 'Not allowed to comment on this task' });
    }

    // Superior can comment for feedback; only owner edits task fields
    task.comments.push({
      author: req.user._id,
      authorName: req.user.username,
      body: body.trim()
    });
    await task.save();

    res.status(201).json({ task });
  } catch (error) {
    console.error('Workboard add comment error:', error);
    res.status(500).json({ message: 'Failed to add comment' });
  }
};

const loadReportPayload = async ({ period, date, ownerId }) => {
  const { startDate, endDate } = getRangeForPeriod(period, date);
  const tasks = await WorkboardTask.find({
    owner: ownerId,
    date: { $gte: startDate, $lte: endDate }
  })
    .sort({ date: 1, startTime: 1, createdAt: 1 })
    .lean();

  const owner = await User.findById(ownerId).select('username email');
  const normalizedTasks = tasks.map((task) => ({
    ...task,
    status: normalizeTaskStatus(task.status)
  }));
  const summary = summarizeTasks(normalizedTasks);

  return {
    period,
    startDate,
    endDate,
    owner,
    ownerName: owner?.username || 'Worker',
    summary,
    tasks: normalizedTasks
  };
};

const buildReportDocx = ({ ownerName, period, startDate, endDate, tasks, summary }) => {
  const periodTitle = PERIOD_TITLES[period] || 'Daily';
  const rangeLabel = formatRangeLabel(period, startDate, endDate);
  const children = [
    new Paragraph({
      text: `Taskboard Report — ${periodTitle}`,
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 200 }
    }),
    new Paragraph({
      children: [
        new TextRun({ text: 'Worker: ', bold: true }),
        new TextRun(ownerName)
      ],
      spacing: { after: 60 }
    }),
    new Paragraph({
      children: [
        new TextRun({ text: 'Date range: ', bold: true }),
        new TextRun(rangeLabel)
      ],
      spacing: { after: 200 }
    }),
    new Paragraph({
      text: 'Summary',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 120, after: 120 }
    }),
    new Paragraph({
      text: `Total tasks: ${summary.total}`,
      spacing: { after: 40 }
    }),
    new Paragraph({ text: `Started: ${summary.started}`, spacing: { after: 40 } }),
    new Paragraph({ text: `In progress: ${summary.in_progress}`, spacing: { after: 40 } }),
    new Paragraph({ text: `Almost done: ${summary.almost_done}`, spacing: { after: 40 } }),
    new Paragraph({ text: `Completed: ${summary.completed}`, spacing: { after: 40 } }),
    new Paragraph({ text: `Postponed: ${summary.postponed}`, spacing: { after: 200 } }),
    new Paragraph({
      text: 'Tasks',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 120, after: 120 }
    })
  ];

  if (tasks.length === 0) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: 'No tasks in this period.', italics: true })],
        spacing: { after: 120 }
      })
    );
  } else {
    const byDate = {};
    tasks.forEach((task) => {
      if (!byDate[task.date]) byDate[task.date] = [];
      byDate[task.date].push(task);
    });

    Object.keys(byDate)
      .sort()
      .forEach((dateKey) => {
        const weekday = WEEKDAY_NAMES[parseDateKey(dateKey).getDay()];
        children.push(
          new Paragraph({
            text: `${weekday} · ${formatDisplayDate(dateKey)}`,
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 100 }
          })
        );

        byDate[dateKey].forEach((task) => {
          const timeLabel = formatTimeRange12h(task.startTime, task.endTime);
          const status = STATUS_LABELS[task.status] || task.status;

          children.push(
            new Paragraph({
              children: [new TextRun({ text: task.title || 'Untitled', bold: true })],
              spacing: { before: 80, after: 40 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Status: ', bold: true }),
                new TextRun(status)
              ],
              spacing: { after: 20 }
            })
          );

          if (timeLabel) {
            children.push(
              new Paragraph({
                children: [
                  new TextRun({ text: 'Time: ', bold: true }),
                  new TextRun(timeLabel)
                ],
                spacing: { after: 20 }
              })
            );
          }

          if (task.assignedBy) {
            children.push(
              new Paragraph({
                children: [
                  new TextRun({ text: 'Assigned by: ', bold: true }),
                  new TextRun(task.assignedBy)
                ],
                spacing: { after: 20 }
              })
            );
          }

          if (task.tag) {
            children.push(
              new Paragraph({
                children: [
                  new TextRun({ text: 'Tag: ', bold: true }),
                  new TextRun(task.tag)
                ],
                spacing: { after: 20 }
              })
            );
          }

          if (task.description) {
            children.push(
              new Paragraph({
                children: [
                  new TextRun({ text: 'Notes: ', bold: true }),
                  new TextRun(task.description)
                ],
                spacing: { after: 60 }
              })
            );
          }
        });
      });
  }

  return new Document({
    sections: [
      {
        properties: {},
        children
      }
    ]
  });
};

const parseReportQuery = async (req) => {
  const period = req.query.period || 'day';
  const date = req.query.date || toDateKey(new Date());

  if (!['day', 'week', 'month'].includes(period)) {
    return { error: { status: 400, message: 'period must be day, week, or month' } };
  }
  if (!DATE_RE.test(date)) {
    return { error: { status: 400, message: 'Valid date (YYYY-MM-DD) is required' } };
  }

  const ownerId = await resolveOwnerId(req);
  if (!ownerId) {
    return { error: { status: 400, message: 'Valid worker ownerId is required' } };
  }

  return { period, date, ownerId };
};

const getReport = async (req, res) => {
  try {
    const parsed = await parseReportQuery(req);
    if (parsed.error) {
      return res.status(parsed.error.status).json({ message: parsed.error.message });
    }

    const payload = await loadReportPayload(parsed);
    const markdown = buildReportMarkdown({
      ownerName: payload.ownerName,
      period: payload.period,
      startDate: payload.startDate,
      endDate: payload.endDate,
      tasks: payload.tasks,
      summary: payload.summary
    });

    res.json({
      period: payload.period,
      startDate: payload.startDate,
      endDate: payload.endDate,
      owner: payload.owner
        ? { id: payload.owner._id, username: payload.owner.username, email: payload.owner.email }
        : null,
      summary: payload.summary,
      tasks: payload.tasks,
      markdown
    });
  } catch (error) {
    console.error('Workboard report error:', error);
    res.status(500).json({ message: 'Failed to generate report' });
  }
};

const getReportDocx = async (req, res) => {
  try {
    const parsed = await parseReportQuery(req);
    if (parsed.error) {
      return res.status(parsed.error.status).json({ message: parsed.error.message });
    }

    const payload = await loadReportPayload(parsed);
    const doc = buildReportDocx({
      ownerName: payload.ownerName,
      period: payload.period,
      startDate: payload.startDate,
      endDate: payload.endDate,
      tasks: payload.tasks,
      summary: payload.summary
    });

    const buffer = await Packer.toBuffer(doc);
    const filename = buildDocxFilename(payload.period, payload.startDate, payload.endDate);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
  } catch (error) {
    console.error('Workboard report docx error:', error);
    res.status(500).json({ message: 'Failed to generate Word report' });
  }
};

const createShareLink = async (req, res) => {
  try {
    if (!canEditWorkboard(req.user) && req.user.role !== 'superior') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const period = req.body.period || 'day';
    const date = req.body.date || toDateKey(new Date());

    if (!['day', 'week', 'month'].includes(period)) {
      return res.status(400).json({ message: 'period must be day, week, or month' });
    }
    if (!DATE_RE.test(date)) {
      return res.status(400).json({ message: 'Valid date (YYYY-MM-DD) is required' });
    }

    const ownerId = await resolveOwnerId(req);
    if (!ownerId) {
      return res.status(400).json({ message: 'Valid worker ownerId is required' });
    }

    if (canEditWorkboard(req.user) && ownerId !== req.user._id.toString() && req.user.role !== 'superior') {
      return res.status(403).json({ message: 'You can only share your own taskboard' });
    }

    const { startDate, endDate } = getRangeForPeriod(period, date);
    const token = crypto.randomBytes(24).toString('hex');

    const share = await WorkboardShare.create({
      token,
      owner: ownerId,
      createdBy: req.user._id,
      period,
      startDate,
      endDate,
      anchorDate: date
    });

    res.status(201).json({
      token: share.token,
      period: share.period,
      startDate: share.startDate,
      endDate: share.endDate,
      anchorDate: share.anchorDate || share.startDate,
      expiresAt: share.expiresAt,
      path: `${TASKBOARD_SHARE_PATH_PREFIX}/${share.token}`,
      url: buildTaskboardShareUrl(req, share.token)
    });
  } catch (error) {
    console.error('Workboard share create error:', error);
    res.status(500).json({ message: 'Failed to create share link' });
  }
};

const getSharedReport = async (req, res) => {
  try {
    const share = await WorkboardShare.findOne({ token: req.params.token });
    if (!share) {
      return res.status(404).json({ message: 'Share link not found' });
    }
    if (share.expiresAt && share.expiresAt.getTime() < Date.now()) {
      return res.status(410).json({ message: 'Share link has expired' });
    }

    const tasks = await WorkboardTask.find({
      owner: share.owner,
      date: { $gte: share.startDate, $lte: share.endDate }
    })
      .sort({ date: 1, startTime: 1, createdAt: 1 })
      .lean();

    const owner = await User.findById(share.owner).select('username email');
    const normalizedTasks = tasks.map((task) => ({
      ...task,
      status: normalizeTaskStatus(task.status)
    }));
    const tasksByDate = {};
    normalizedTasks.forEach((task) => {
      if (!tasksByDate[task.date]) tasksByDate[task.date] = [];
      tasksByDate[task.date].push(task);
    });
    Object.keys(tasksByDate).forEach((key) => {
      tasksByDate[key] = sortTasks(tasksByDate[key]);
    });
    const summary = summarizeTasks(normalizedTasks);
    const markdown = buildReportMarkdown({
      ownerName: owner?.username || 'Worker',
      period: share.period,
      startDate: share.startDate,
      endDate: share.endDate,
      tasks: normalizedTasks,
      summary
    });

    const presence = await WorkboardPresence.findOne({ user: share.owner });
    const anchorDate = share.anchorDate || share.startDate;
    const access = await buildShareAccessPayload(share, req.user?._id);

    res.json({
      period: share.period,
      startDate: share.startDate,
      endDate: share.endDate,
      anchorDate,
      owner: owner
        ? { id: owner._id, username: owner.username, email: owner.email }
        : null,
      presence: {
        status: isPresenceOnline(presence) ? 'online' : 'offline',
        lastSeen: presence?.lastSeen || null
      },
      summary,
      tasks: normalizedTasks,
      tasksByDate,
      markdown,
      readOnly: access.readOnly,
      permission: access.permission,
      myPermissions: access.myPermissions,
      accessRequest: access.accessRequest
    });
  } catch (error) {
    console.error('Workboard shared report error:', error);
    res.status(500).json({ message: 'Failed to load shared report' });
  }
};

const heartbeat = async (req, res) => {
  try {
    if (!canEditWorkboard(req.user)) {
      return res.status(403).json({ message: 'Only admin workers publish presence' });
    }

    const presence = await WorkboardPresence.findOneAndUpdate(
      { user: req.user._id },
      {
        user: req.user._id,
        status: 'online',
        lastSeen: new Date()
      },
      { upsert: true, new: true }
    );

    res.json({
      presence: {
        status: 'online',
        lastSeen: presence.lastSeen
      }
    });
  } catch (error) {
    console.error('Workboard heartbeat error:', error);
    res.status(500).json({ message: 'Failed to update presence' });
  }
};

const goOffline = async (req, res) => {
  try {
    if (!canEditWorkboard(req.user)) {
      return res.json({ presence: { status: 'offline', lastSeen: new Date() } });
    }

    const presence = await WorkboardPresence.findOneAndUpdate(
      { user: req.user._id },
      {
        user: req.user._id,
        status: 'offline',
        lastSeen: new Date()
      },
      { upsert: true, new: true }
    );

    res.json({
      presence: {
        status: 'offline',
        lastSeen: presence.lastSeen
      }
    });
  } catch (error) {
    console.error('Workboard offline error:', error);
    res.status(500).json({ message: 'Failed to update presence' });
  }
};

const getPresence = async (req, res) => {
  try {
    const ownerId = await resolveOwnerId(req);
    if (!ownerId) {
      return res.status(400).json({ message: 'Valid worker ownerId is required' });
    }

    const presence = await WorkboardPresence.findOne({ user: ownerId });
    res.json({
      ownerId,
      presence: {
        status: isPresenceOnline(presence) ? 'online' : 'offline',
        lastSeen: presence?.lastSeen || null
      }
    });
  } catch (error) {
    console.error('Workboard get presence error:', error);
    res.status(500).json({ message: 'Failed to load presence' });
  }
};

const getTags = async (req, res) => {
  try {
    const ownerId = await resolveOwnerId(req);
    if (!ownerId) {
      return res.status(400).json({ message: 'Valid worker ownerId is required' });
    }

    res.json({ tags: await listTagNames(ownerId) });
  } catch (error) {
    console.error('Workboard get tags error:', error);
    res.status(500).json({ message: 'Failed to load tags' });
  }
};

const createTag = async (req, res) => {
  try {
    if (!canEditWorkboard(req.user)) {
      return res.status(403).json({ message: 'Only admins can create workboard tags' });
    }

    const name = normalizeTagName(req.body.name);
    if (!name) {
      return res.status(400).json({ message: 'Tag name is required' });
    }

    const savedName = await upsertTag(req.user._id, name);
    res.status(201).json({
      tag: savedName,
      tags: await listTagNames(req.user._id)
    });
  } catch (error) {
    console.error('Workboard create tag error:', error);
    res.status(500).json({ message: 'Failed to create tag' });
  }
};

/**
 * Lightweight history payload for streaks / royal score.
 * Returns lean task fields + owner's workboardXp + visit streak state.
 */
const getGamificationStats = async (req, res) => {
  try {
    const ownerId = await resolveOwnerId(req);
    if (!ownerId) {
      return res.status(400).json({ message: 'Valid worker ownerId is required' });
    }

    const endDate = toDateKey(new Date());
    const startDate = addDays(endDate, -(GAMIFICATION_LOOKBACK_DAYS - 1));
    const streakFields =
      'workboardXp username workboardAchievements workboardVisitStreak workboardLongestStreak workboardLastVisitDate workboardStreakBeforeBreak workboardStreakRestoreMonth workboardStreakRestoreCount';

    const [owner, tasks] = await Promise.all([
      User.findById(ownerId).select(streakFields),
      WorkboardTask.find({
        owner: ownerId,
        $or: [
          { date: { $gte: startDate, $lte: endDate } },
          { originalDate: { $gte: startDate, $lte: endDate } }
        ]
      })
        .select(
          'date originalDate rolledFromDate status priority xpAwarded completedAt cancelledAt title focusTime project tag startTime endTime createdAt updatedAt'
        )
        .lean()
    ]);

    if (!owner) {
      return res.status(404).json({ message: 'Owner not found' });
    }

    const normalized = tasks.map((task) => ({
      ...task,
      status: normalizeTaskStatus(task.status),
      priority: normalizePriority(task.priority),
      originalDate: task.originalDate || task.date || null
    }));

    const isOwnBoard =
      canEditWorkboard(req.user) && ownerId === req.user._id.toString();
    let streakPayload = buildStreakPayload(owner, endDate);

    if (isOwnBoard) {
      const visitResult = await recordVisit(owner, endDate);
      streakPayload = visitResult.streak;

      if (visitResult.changed) {
        await runAchievementSync(ownerId);
      }
    }

    res.json({
      ownerId,
      totalXp: owner.workboardXp || 0,
      startDate,
      endDate,
      tasks: normalized,
      achievements: owner.workboardAchievements || [],
      streak: streakPayload
    });
  } catch (error) {
    console.error('Workboard gamification stats error:', error);
    res.status(500).json({ message: 'Failed to load gamification stats' });
  }
};

const restoreVisitStreak = async (req, res) => {
  try {
    if (!canEditWorkboard(req.user)) {
      return res.status(403).json({ message: 'Not allowed to restore streak' });
    }

    const ownerId = req.user._id.toString();
    const todayKey = streakToDateKey();
    const user = await User.findById(ownerId).select(
      'workboardXp workboardVisitStreak workboardLongestStreak workboardLastVisitDate workboardStreakBeforeBreak workboardStreakRestoreMonth workboardStreakRestoreCount workboardAchievements'
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const result = await restoreStreak(user, todayKey);
    if (!result.ok) {
      return res.status(400).json({ message: result.message });
    }

    const achievementResult = await runAchievementSync(ownerId);

    res.json({
      streak: result.streak,
      totalXp: result.totalXp,
      achievements: achievementResult.list || [],
      newlyUnlocked: achievementResult.newlyUnlocked || []
    });
  } catch (error) {
    console.error('Workboard streak restore error:', error);
    res.status(500).json({ message: 'Failed to restore streak' });
  }
};

module.exports = {
  getWorkers,
  getTasks,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  addComment,
  getReport,
  getReportDocx,
  createShareLink,
  getSharedReport,
  heartbeat,
  goOffline,
  getPresence,
  getTags,
  createTag,
  getGamificationStats,
  restoreVisitStreak
};
