const mongoose = require('mongoose');

const artboardShareSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    artboard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artboard',
      required: true,
      index: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    permission: {
      type: String,
      enum: ['edit'],
      default: 'edit'
    },
    expiresAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('ArtboardShare', artboardShareSchema);
