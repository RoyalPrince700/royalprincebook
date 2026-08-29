const mongoose = require('mongoose');

/** Lightweight weekly objective (target vs current). */
const workboardObjectiveSchema = new mongoose.Schema({
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
  category: {
    type: String,
    trim: true,
    maxlength: 60,
    default: ''
  },
  target: {
    type: Number,
    required: true,
    min: 1
  },
  current: {
    type: Number,
    default: 0,
    min: 0
  },
  /** Sunday of the work week this objective belongs to (YYYY-MM-DD). */
  weekStart: {
    type: String,
    required: true,
    match: /^\d{4}-\d{2}-\d{2}$/,
    index: true
  },
  deadline: {
    type: String,
    default: '',
    match: /^$|^\d{4}-\d{2}-\d{2}$/
  },
  completed: {
    type: Boolean,
    default: false,
    index: true
  },
  completedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

workboardObjectiveSchema.index({ owner: 1, weekStart: 1 });

module.exports = mongoose.model('WorkboardObjective', workboardObjectiveSchema);
