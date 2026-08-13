const mongoose = require('mongoose');

const workboardShareSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  period: {
    type: String,
    enum: ['day', 'week', 'month'],
    required: true
  },
  startDate: {
    type: String,
    required: true,
    match: /^\d{4}-\d{2}-\d{2}$/
  },
  endDate: {
    type: String,
    required: true,
    match: /^\d{4}-\d{2}-\d{2}$/
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('WorkboardShare', workboardShareSchema);
