const mongoose = require('mongoose');

const workboardLeaderboardInviteSchema = new mongoose.Schema(
  {
    leaderboard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WorkboardLeaderboard',
      required: true,
      index: true
    },
    invitedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined'],
      default: 'pending'
    },
    /** Invitee workboardXp snapshot when the invite was sent. */
    xpBaseline: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  { timestamps: true }
);

workboardLeaderboardInviteSchema.index({ leaderboard: 1, invitedUser: 1 }, { unique: true });

module.exports = mongoose.model('WorkboardLeaderboardInvite', workboardLeaderboardInviteSchema);
