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
    enum: ['started', 'in_progress', 'almost_done', 'completed', 'postponed'],
    default: 'started',
    index: true
  },
  assignedBy: {
    type: String,
    trim: true,
    maxlength: 80,
    default: ''
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
