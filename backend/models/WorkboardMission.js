const mongoose = require('mongoose');

/** Optional custom daily mission title for a given date. */
const workboardMissionSchema = new mongoose.Schema({
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
  customTitle: {
    type: String,
    trim: true,
    maxlength: 200,
    default: ''
  }
}, {
  timestamps: true
});

workboardMissionSchema.index({ owner: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('WorkboardMission', workboardMissionSchema);
