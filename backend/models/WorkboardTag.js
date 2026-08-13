const mongoose = require('mongoose');

const workboardTagSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 40
  },
  nameKey: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    maxlength: 40
  }
}, {
  timestamps: true
});

workboardTagSchema.index({ owner: 1, nameKey: 1 }, { unique: true });

module.exports = mongoose.model('WorkboardTag', workboardTagSchema);
