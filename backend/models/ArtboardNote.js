const mongoose = require('mongoose');

const NOTE_COLORS = ['yellow', 'mint', 'peach', 'sky', 'lilac'];

const artboardNoteSchema = new mongoose.Schema({
  artboard: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artboard',
    required: true,
    index: true
  },
  text: {
    type: String,
    trim: true,
    maxlength: 500,
    default: ''
  },
  color: {
    type: String,
    enum: NOTE_COLORS,
    default: 'yellow'
  },
  x: {
    type: Number,
    required: true,
    default: 120
  },
  y: {
    type: Number,
    required: true,
    default: 120
  },
  zIndex: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

artboardNoteSchema.index({ artboard: 1, createdAt: 1 });

module.exports = mongoose.model('ArtboardNote', artboardNoteSchema);
module.exports.NOTE_COLORS = NOTE_COLORS;
