const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 80
  },
  body: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { _id: true });

const workboardTaskSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 160
  },
  description: {
    type: String,
    trim: true,
    maxlength: 4000,
    default: ''
  },
  date: {
    type: String,
    required: true,
    match: /^\d{4}-\d{2}-\d{2}$/,
    index: true
  },
  /**
   * First date this task was scheduled for.
   * Frozen on create; date may change later (rollover) without rewriting this.
   * Legacy tasks: treat missing originalDate as date.
   */
  originalDate: {
    type: String,
    match: /^\d{4}-\d{2}-\d{2}$/,
    default: null,
    index: true
  },
  /** Previous date when last moved (analytics / rollover trail). */
  rolledFromDate: {
    type: String,
    match: /^\d{4}-\d{2}-\d{2}$/,
    default: null
  },
  startTime: {
    type: String,
    trim: true,
    default: '',
    maxlength: 5
  },
  endTime: {
    type: String,
    trim: true,
    default: '',
    maxlength: 5
  },
  status: {
    type: String,
    enum: ['started', 'in_progress', 'almost_done', 'completed', 'postponed', 'cancelled'],
    default: 'started',
    index: true
  },
  cancelledAt: {
    type: Date,
    default: null
  },
  assignedBy: {
    type: String,
    trim: true,
    maxlength: 80,
    default: ''
  },
  tag: {
    type: String,
    trim: true,
    maxlength: 40,
    default: ''
  },
  /** Priority drives XP on completion. Defaults keep legacy tasks compatible. */
  priority: {
    type: String,
    enum: ['LOW', 'NORMAL', 'HIGH', 'CRITICAL'],
    default: 'NORMAL',
    index: true
  },
  /** Idempotency lock: XP already granted for this completion cycle. */
  xpAwarded: {
    type: Number,
    default: 0,
    min: 0
  },
  completedAt: {
    type: Date,
    default: null
  },
  /** Accumulated focus-mode seconds for this task. */
  focusTime: {
    type: Number,
    default: 0,
    min: 0
  },
  /** Optional project (Boss Battle) link. */
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WorkboardProject',
    default: null,
    index: true
  },
  comments: {
    type: [commentSchema],
    default: []
  }
}, {
  timestamps: true
});

workboardTaskSchema.index({ owner: 1, date: 1 });

module.exports = mongoose.model('WorkboardTask', workboardTaskSchema);
