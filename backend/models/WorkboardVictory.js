const mongoose = require('mongoose');

/**
 * End-of-day reflective win entry.
 * Snapshot fields freeze the day's stats at save time (real numbers only).
 */
const workboardVictorySchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  date: {
    type: String,
    required: true,
    match: /^\d{4}-\d{2}-\d{2}$/,
    index: true
  },
  winText: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  tasksCompleted: {
    type: Number,
    default: 0,
    min: 0
  },
  xpEarned: {
    type: Number,
    default: 0,
    min: 0
  },
  royalScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

workboardVictorySchema.index({ owner: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('WorkboardVictory', workboardVictorySchema);
