const mongoose = require('mongoose');

const artboardSchema = new mongoose.Schema({
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
    maxlength: 120
  }
}, {
  timestamps: true
});

artboardSchema.index({ owner: 1, updatedAt: -1 });

module.exports = mongoose.model('Artboard', artboardSchema);
