const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    startsAt: {
      type: Date,
      required: true
    },
    joinUrl: {
      type: String,
      default: '',
      trim: true
    }
  },
  { _id: false }
);

const workshopEventSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    timezone: {
      type: String,
      default: 'Africa/Lagos'
    },
    recordingsUrl: {
      type: String,
      default: '',
      trim: true
    },
    sessions: {
      type: [sessionSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('WorkshopEvent', workshopEventSchema);
