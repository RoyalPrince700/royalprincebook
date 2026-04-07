const mongoose = require('mongoose');

const analyticsEventSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['pageview', 'performance'],
    required: true
  },
  path: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    trim: true
  },
  referrer: {
    type: String,
    trim: true
  },
  referrerHost: {
    type: String,
    trim: true
  },
  visitorId: {
    type: String,
    required: true,
    trim: true
  },
  sessionId: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  },
  browser: {
    type: String,
    trim: true
  },
  os: {
    type: String,
    trim: true
  },
  deviceType: {
    type: String,
    enum: ['desktop', 'mobile', 'tablet', 'unknown'],
    default: 'unknown'
  },
  viewportWidth: {
    type: Number
  },
  viewportHeight: {
    type: Number
  },
  connectionType: {
    type: String,
    trim: true
  },
  metrics: {
    pageLoadMs: Number,
    domContentLoadedMs: Number,
    firstContentfulPaintMs: Number,
    routeRenderMs: Number
  }
}, {
  timestamps: true
});

analyticsEventSchema.index({ type: 1, createdAt: -1 });
analyticsEventSchema.index({ path: 1, type: 1, createdAt: -1 });
analyticsEventSchema.index({ visitorId: 1, createdAt: -1 });

module.exports = mongoose.model('AnalyticsEvent', analyticsEventSchema);
