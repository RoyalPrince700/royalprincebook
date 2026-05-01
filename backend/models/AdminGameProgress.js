const mongoose = require('mongoose');

const segmentProgressSchema = new mongoose.Schema({
  vocabulary: { type: Number, default: 0, min: 0, max: 100 },
  conciseness: { type: Number, default: 0, min: 0, max: 100 },
  concisePick: { type: Number, default: 0, min: 0, max: 100 },
  connectors: { type: Number, default: 0, min: 0, max: 100 },
  fluentFraming: { type: Number, default: 0, min: 0, max: 100 },
  speech: { type: Number, default: 0, min: 0, max: 100 },
  presentation: { type: Number, default: 0, min: 0, max: 100 },
  pronunciation: { type: Number, default: 0, min: 0, max: 100 }
}, { _id: false });

const segmentScoresSchema = new mongoose.Schema({
  vocabulary: { type: Number, default: 0, min: 0 },
  conciseness: { type: Number, default: 0, min: 0 },
  concisePick: { type: Number, default: 0, min: 0 },
  connectors: { type: Number, default: 0, min: 0 },
  fluentFraming: { type: Number, default: 0, min: 0 },
  speech: { type: Number, default: 0, min: 0 },
  presentation: { type: Number, default: 0, min: 0 },
  pronunciation: { type: Number, default: 0, min: 0 }
}, { _id: false });

const recentActivitySchema = new mongoose.Schema({
  segment: {
    type: String,
    enum: ['vocabulary', 'conciseness', 'concisePick', 'connectors', 'fluentFraming', 'speech', 'presentation', 'pronunciation'],
    required: true
  },
  title: { type: String, required: true, trim: true, maxlength: 120 },
  points: { type: Number, default: 0, min: 0 },
  feedback: { type: String, trim: true, maxlength: 500 },
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

const adminGameProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  progress: {
    type: segmentProgressSchema,
    default: () => ({})
  },
  segmentScores: {
    type: segmentScoresSchema,
    default: () => ({})
  },
  score: { type: Number, default: 0, min: 0 },
  streak: { type: Number, default: 0, min: 0 },
  level: {
    type: String,
    enum: ['Articulate Novice', 'Clear Communicator', 'Eloquent Presenter', 'Confident Orator', 'Royal Orator'],
    default: 'Articulate Novice'
  },
  completedSessions: { type: Number, default: 0, min: 0 },
  achievements: [{ type: String, trim: true, maxlength: 80 }],
  recentActivity: {
    type: [recentActivitySchema],
    default: []
  },
  lastPlayed: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('AdminGameProgress', adminGameProgressSchema);
