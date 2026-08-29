const mongoose = require('mongoose');

const workboardCollaboratorGrantSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    collaborator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    permissions: {
      type: [String],
      default: []
    },
    grantedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    sourceRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WorkboardAccessRequest',
      default: null
    },
    revokedAt: {
      type: Date,
      default: null,
      index: true
    },
    expiresAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

workboardCollaboratorGrantSchema.index(
  { owner: 1, collaborator: 1 },
  { unique: true, partialFilterExpression: { revokedAt: null } }
);

module.exports = mongoose.model('WorkboardCollaboratorGrant', workboardCollaboratorGrantSchema);
