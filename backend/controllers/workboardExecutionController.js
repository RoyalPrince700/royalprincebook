const WorkboardTask = require('../models/WorkboardTask');
const WorkboardProject = require('../models/WorkboardProject');
const WorkboardObjective = require('../models/WorkboardObjective');
const WorkboardMission = require('../models/WorkboardMission');
const WorkboardVictory = require('../models/WorkboardVictory');
const User = require('../models/User');
const { canEditWorkboard } = require('../middleware/auth');
const {
  syncUserAchievements,
  listAchievementsForUser,
  calculateCurrentStreak,
  toDateKey
} = require('../utils/workboardAchievements');

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const resolveOwnerId = async (req) => {
  const requestedOwnerId = req.query.ownerId || req.body.ownerId;

  if (req.user.role === 'superior') {
    if (!requestedOwnerId) {
      const firstAdmin = await User.findOne({ role: 'admin', isActive: true }).select('_id');
      return firstAdmin?._id?.toString() || null;
    }
    const owner = await User.findById(requestedOwnerId).select('role isActive');
    if (!owner || owner.role !== 'admin' || !owner.isActive) return null;
    return owner._id.toString();
  }

  if (requestedOwnerId && requestedOwnerId !== req.user._id.toString()) {
    if (req.user.role !== 'admin') return null;
    const owner = await User.findById(requestedOwnerId).select('role isActive');
    if (!owner || owner.role !== 'admin' || !owner.isActive) return null;
    return owner._id.toString();
  }

  return req.user._id.toString();
};

const loadAchievementContext = async (ownerId) => {
  const [owner, tasks] = await Promise.all([
    User.findById(ownerId).select('workboardXp workboardAchievements'),
    WorkboardTask.find({ owner: ownerId })
      .select('date originalDate rolledFromDate status priority focusTime xpAwarded completedAt cancelledAt')
      .lean()
  ]);

  const todayKey = toDateKey(new Date());
  const streak = calculateCurrentStreak(tasks, todayKey);

  return {
    owner,
    tasks,
    todayKey,
    streak,
    totalXp: owner?.workboardXp || 0
  };
};

const runAchievementSync = async (ownerId) => {
  const ctx = await loadAchievementContext(ownerId);
  if (!ctx.owner) {
    return { achievements: [], newlyUnlocked: [], list: [] };
  }

  const result = await syncUserAchievements(ctx.owner, {
    tasks: ctx.tasks,
    totalXp: ctx.totalXp,
    currentStreak: ctx.streak,
    todayKey: ctx.todayKey
  });

  return {
    ...result,
    list: listAchievementsForUser(result.achievements)
  };
};

const projectProgress = (tasks = []) => {
  const planned = tasks.filter((task) => String(task.status) !== 'postponed');
  const completed = planned.filter((task) => String(task.status) === 'completed');
  const total = planned.length;
  const done = completed.length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  return { total, done, percent };
};

/* ——— Projects (Boss Battles) ——— */

const listProjects = async (req, res) => {
  try {
    const ownerId = await resolveOwnerId(req);
    if (!ownerId) {
      return res.status(400).json({ message: 'Valid worker ownerId is required' });
    }

    const projects = await WorkboardProject.find({ owner: ownerId })
      .sort({ status: 1, updatedAt: -1 })
      .lean();

    const projectIds = projects.map((project) => project._id);
    const tasks = await WorkboardTask.find({
      owner: ownerId,
      project: { $in: projectIds }
    })
      .select('title status priority date project focusTime')
      .lean();

    const tasksByProject = new Map();
    tasks.forEach((task) => {
      const key = String(task.project);
      if (!tasksByProject.has(key)) tasksByProject.set(key, []);
      tasksByProject.get(key).push(task);
    });

    res.json({
      projects: projects.map((project) => {
        const projectTasks = tasksByProject.get(String(project._id)) || [];
        return {
          ...project,
          progress: projectProgress(projectTasks),
          tasks: projectTasks
        };
      }),
      canEdit: canEditWorkboard(req.user) && ownerId === req.user._id.toString()
    });
  } catch (error) {
    console.error('Workboard list projects error:', error);
    res.status(500).json({ message: 'Failed to load projects' });
  }
};

const createProject = async (req, res) => {
  try {
    if (!canEditWorkboard(req.user)) {
      return res.status(403).json({ message: 'Only admins can create projects' });
    }

    const title = String(req.body.title || '').trim();
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const project = await WorkboardProject.create({
      owner: req.user._id,
      title: title.slice(0, 160),
      description: String(req.body.description || '').trim().slice(0, 2000),
      status: 'active'
    });

    res.status(201).json({
      project: { ...project.toObject(), progress: { total: 0, done: 0, percent: 0 }, tasks: [] }
    });
  } catch (error) {
    console.error('Workboard create project error:', error);
    res.status(500).json({ message: 'Failed to create project' });
  }
};

const updateProject = async (req, res) => {
  try {
    if (!canEditWorkboard(req.user)) {
      return res.status(403).json({ message: 'Only admins can update projects' });
    }

    const project = await WorkboardProject.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only edit your own projects' });
    }

    if (req.body.title !== undefined) {
      const title = String(req.body.title || '').trim();
      if (!title) return res.status(400).json({ message: 'Title cannot be empty' });
      project.title = title.slice(0, 160);
    }
    if (req.body.description !== undefined) {
      project.description = String(req.body.description || '').trim().slice(0, 2000);
    }
    if (req.body.status !== undefined) {
      if (!['active', 'completed'].includes(req.body.status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
      project.status = req.body.status;
      project.completedAt = req.body.status === 'completed' ? new Date() : null;
    }

    await project.save();

    const tasks = await WorkboardTask.find({ owner: req.user._id, project: project._id })
      .select('title status priority date project focusTime')
      .lean();

    res.json({
      project: {
        ...project.toObject(),
        progress: projectProgress(tasks),
        tasks
      }
    });
  } catch (error) {
    console.error('Workboard update project error:', error);
    res.status(500).json({ message: 'Failed to update project' });
  }
};

const deleteProject = async (req, res) => {
  try {
    if (!canEditWorkboard(req.user)) {
      return res.status(403).json({ message: 'Only admins can delete projects' });
    }

    const project = await WorkboardProject.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own projects' });
    }

    await WorkboardTask.updateMany(
      { owner: req.user._id, project: project._id },
      { $set: { project: null } }
    );
    await project.deleteOne();

    res.json({ message: 'Project deleted' });
  } catch (error) {
    console.error('Workboard delete project error:', error);
    res.status(500).json({ message: 'Failed to delete project' });
  }
};

/* ——— Focus time ——— */

const addFocusTime = async (req, res) => {
  try {
    if (!canEditWorkboard(req.user)) {
      return res.status(403).json({ message: 'Only admins can update focus time' });
    }

    const seconds = Math.max(0, Math.floor(Number(req.body.seconds) || 0));
    if (seconds <= 0) {
      return res.status(400).json({ message: 'seconds must be a positive number' });
    }

    const task = await WorkboardTask.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    if (task.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only update your own tasks' });
    }

    task.focusTime = (Number(task.focusTime) || 0) + seconds;
    await task.save();

    const achievementSync = await runAchievementSync(req.user._id);

    res.json({
      task,
      newlyUnlocked: achievementSync.newlyUnlocked
    });
  } catch (error) {
    console.error('Workboard add focus time error:', error);
    res.status(500).json({ message: 'Failed to save focus time' });
  }
};

/* ——— Daily mission ——— */

const getMission = async (req, res) => {
  try {
    const ownerId = await resolveOwnerId(req);
    if (!ownerId) {
      return res.status(400).json({ message: 'Valid worker ownerId is required' });
    }

    const date = DATE_RE.test(req.query.date) ? req.query.date : toDateKey(new Date());
    const mission = await WorkboardMission.findOne({ owner: ownerId, date }).lean();

    res.json({
      date,
      customTitle: mission?.customTitle || '',
      mission
    });
  } catch (error) {
    console.error('Workboard get mission error:', error);
    res.status(500).json({ message: 'Failed to load mission' });
  }
};

const upsertMission = async (req, res) => {
  try {
    if (!canEditWorkboard(req.user)) {
      return res.status(403).json({ message: 'Only admins can set daily mission' });
    }

    const date = DATE_RE.test(req.body.date) ? req.body.date : toDateKey(new Date());
    const customTitle = String(req.body.customTitle || '').trim().slice(0, 200);

    const mission = await WorkboardMission.findOneAndUpdate(
      { owner: req.user._id, date },
      { customTitle },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json({ date, customTitle: mission.customTitle, mission });
  } catch (error) {
    console.error('Workboard upsert mission error:', error);
    res.status(500).json({ message: 'Failed to save mission' });
  }
};

/* ——— Weekly objectives ——— */

const listObjectives = async (req, res) => {
  try {
    const ownerId = await resolveOwnerId(req);
    if (!ownerId) {
      return res.status(400).json({ message: 'Valid worker ownerId is required' });
    }

    const filter = { owner: ownerId };
    if (DATE_RE.test(req.query.weekStart)) {
      filter.weekStart = req.query.weekStart;
    }

    const objectives = await WorkboardObjective.find(filter)
      .sort({ completed: 1, createdAt: -1 })
      .lean();

    res.json({
      objectives,
      canEdit: canEditWorkboard(req.user) && ownerId === req.user._id.toString()
    });
  } catch (error) {
    console.error('Workboard list objectives error:', error);
    res.status(500).json({ message: 'Failed to load objectives' });
  }
};

const createObjective = async (req, res) => {
  try {
    if (!canEditWorkboard(req.user)) {
      return res.status(403).json({ message: 'Only admins can create objectives' });
    }

    const title = String(req.body.title || '').trim();
    const target = Number(req.body.target);
    const weekStart = req.body.weekStart;

    if (!title) return res.status(400).json({ message: 'Title is required' });
    if (!Number.isFinite(target) || target < 1) {
      return res.status(400).json({ message: 'Valid target is required' });
    }
    if (!DATE_RE.test(weekStart)) {
      return res.status(400).json({ message: 'Valid weekStart is required' });
    }

    const current = Math.max(0, Number(req.body.current) || 0);
    const deadline = DATE_RE.test(req.body.deadline) ? req.body.deadline : '';
    const completed = current >= target;

    const objective = await WorkboardObjective.create({
      owner: req.user._id,
      title: title.slice(0, 160),
      category: String(req.body.category || '').trim().slice(0, 60),
      target,
      current,
      weekStart,
      deadline,
      completed,
      completedAt: completed ? new Date() : null
    });

    res.status(201).json({ objective });
  } catch (error) {
    console.error('Workboard create objective error:', error);
    res.status(500).json({ message: 'Failed to create objective' });
  }
};

const updateObjective = async (req, res) => {
  try {
    if (!canEditWorkboard(req.user)) {
      return res.status(403).json({ message: 'Only admins can update objectives' });
    }

    const objective = await WorkboardObjective.findById(req.params.id);
    if (!objective) {
      return res.status(404).json({ message: 'Objective not found' });
    }
    if (objective.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only edit your own objectives' });
    }

    if (req.body.title !== undefined) {
      const title = String(req.body.title || '').trim();
      if (!title) return res.status(400).json({ message: 'Title cannot be empty' });
      objective.title = title.slice(0, 160);
    }
    if (req.body.category !== undefined) {
      objective.category = String(req.body.category || '').trim().slice(0, 60);
    }
    if (req.body.target !== undefined) {
      const target = Number(req.body.target);
      if (!Number.isFinite(target) || target < 1) {
        return res.status(400).json({ message: 'Valid target is required' });
      }
      objective.target = target;
    }
    if (req.body.current !== undefined) {
      objective.current = Math.max(0, Number(req.body.current) || 0);
    }
    if (req.body.deadline !== undefined) {
      objective.deadline = DATE_RE.test(req.body.deadline) ? req.body.deadline : '';
    }
    if (req.body.weekStart !== undefined) {
      if (!DATE_RE.test(req.body.weekStart)) {
        return res.status(400).json({ message: 'Valid weekStart is required' });
      }
      objective.weekStart = req.body.weekStart;
    }
    if (req.body.completed !== undefined) {
      objective.completed = Boolean(req.body.completed);
    } else {
      objective.completed = objective.current >= objective.target;
    }
    objective.completedAt = objective.completed
      ? objective.completedAt || new Date()
      : null;

    await objective.save();
    res.json({ objective });
  } catch (error) {
    console.error('Workboard update objective error:', error);
    res.status(500).json({ message: 'Failed to update objective' });
  }
};

const deleteObjective = async (req, res) => {
  try {
    if (!canEditWorkboard(req.user)) {
      return res.status(403).json({ message: 'Only admins can delete objectives' });
    }

    const objective = await WorkboardObjective.findById(req.params.id);
    if (!objective) {
      return res.status(404).json({ message: 'Objective not found' });
    }
    if (objective.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own objectives' });
    }

    await objective.deleteOne();
    res.json({ message: 'Objective deleted' });
  } catch (error) {
    console.error('Workboard delete objective error:', error);
    res.status(500).json({ message: 'Failed to delete objective' });
  }
};

/* ——— Achievements ——— */

const getAchievements = async (req, res) => {
  try {
    const ownerId = await resolveOwnerId(req);
    if (!ownerId) {
      return res.status(400).json({ message: 'Valid worker ownerId is required' });
    }

    // Sync on read so unlocks stay current without waiting for a mutation.
    const canSync =
      canEditWorkboard(req.user) && ownerId === req.user._id.toString();

    let list;
    let newlyUnlocked = [];

    if (canSync) {
      const synced = await runAchievementSync(ownerId);
      list = synced.list;
      newlyUnlocked = synced.newlyUnlocked;
    } else {
      const owner = await User.findById(ownerId).select('workboardAchievements');
      list = listAchievementsForUser(owner?.workboardAchievements || []);
    }

    res.json({ achievements: list, newlyUnlocked });
  } catch (error) {
    console.error('Workboard get achievements error:', error);
    res.status(500).json({ message: 'Failed to load achievements' });
  }
};

/* ——— Victory Journal ——— */

const listVictories = async (req, res) => {
  try {
    const ownerId = await resolveOwnerId(req);
    if (!ownerId) {
      return res.status(400).json({ message: 'Valid worker ownerId is required' });
    }

    const filter = { owner: ownerId };
    if (DATE_RE.test(String(req.query.date || ''))) {
      filter.date = req.query.date;
    }

    const victories = await WorkboardVictory.find(filter)
      .sort({ date: -1 })
      .limit(120)
      .lean();

    res.json({ victories });
  } catch (error) {
    console.error('Workboard list victories error:', error);
    res.status(500).json({ message: 'Failed to load victory journal' });
  }
};

const upsertVictory = async (req, res) => {
  try {
    if (!canEditWorkboard(req.user)) {
      return res.status(403).json({ message: 'Only admins can write victory journal entries' });
    }

    const ownerId = req.user._id.toString();
    const date = String(req.body.date || '').trim();
    const winText = String(req.body.winText || '').trim();

    if (!DATE_RE.test(date)) {
      return res.status(400).json({ message: 'Valid date is required' });
    }
    if (!winText) {
      return res.status(400).json({ message: 'Win of the day cannot be empty' });
    }

    const tasksCompleted = Math.max(0, Number(req.body.tasksCompleted) || 0);
    const xpEarned = Math.max(0, Number(req.body.xpEarned) || 0);
    const royalScore = Math.min(100, Math.max(0, Number(req.body.royalScore) || 0));

    const victory = await WorkboardVictory.findOneAndUpdate(
      { owner: ownerId, date },
      {
        owner: ownerId,
        date,
        winText: winText.slice(0, 500),
        tasksCompleted,
        xpEarned,
        royalScore
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    res.json({ victory });
  } catch (error) {
    console.error('Workboard upsert victory error:', error);
    res.status(500).json({ message: 'Failed to save victory journal entry' });
  }
};

const deleteVictory = async (req, res) => {
  try {
    if (!canEditWorkboard(req.user)) {
      return res.status(403).json({ message: 'Only admins can delete victory journal entries' });
    }

    const victory = await WorkboardVictory.findById(req.params.id);
    if (!victory) {
      return res.status(404).json({ message: 'Victory entry not found' });
    }
    if (victory.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own entries' });
    }

    await victory.deleteOne();
    res.json({ message: 'Victory entry deleted' });
  } catch (error) {
    console.error('Workboard delete victory error:', error);
    res.status(500).json({ message: 'Failed to delete victory journal entry' });
  }
};

module.exports = {
  listProjects,
  createProject,
  updateProject,
  deleteProject,
  addFocusTime,
  getMission,
  upsertMission,
  listObjectives,
  createObjective,
  updateObjective,
  deleteObjective,
  getAchievements,
  listVictories,
  upsertVictory,
  deleteVictory,
  runAchievementSync
};
