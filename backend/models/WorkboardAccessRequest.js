const mongoose = require('mongoose');

const workboardAccessRequestSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    shareToken: {
      type: String,
      default: '',
      trim: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'denied', 'withdrawn'],
      default: 'pending',
      index: true
    },
    requestedPermissions: {
      type: [String],
      default: []
    },
    grantedPermissions: {
      type: [String],
      default: []
    },
    message: {
      type: String,
      default: '',
      trim: true,
      maxlength: 500
    },
    ownerNote: {
      type: String,
      default: '',
      trim: true,
      maxlength: 500
    },
    resolvedAt: Date,
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

workboardAccessRequestSchema.index(
  { owner: 1, requester: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: 'pending' } }
);

module.exports = mongoose.model('WorkboardAccessRequest', workboardAccessRequestSchema);
