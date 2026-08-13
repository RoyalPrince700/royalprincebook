const mongoose = require('mongoose');

const workboardProjectSchema = new mongoose.Schema({
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
    maxlength: 2000,
    default: ''
  },
  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active',
    index: true
  },
  completedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

workboardProjectSchema.index({ owner: 1, status: 1 });

module.exports = mongoose.model('WorkboardProject', workboardProjectSchema);
