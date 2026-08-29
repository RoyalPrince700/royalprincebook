const mongoose = require('mongoose');

const workboardLeaderboardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    /** User.workboardXp snapshot when the leaderboard was created. */
    ownerXpBaseline: {
      type: Number,
      default: 0,
      min: 0
    },
    members: {
      type: [
        {
          user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
          joinedAt: { type: Date, default: Date.now },
          /** User.workboardXp snapshot when the member joined (invite sent / accepted). */
          xpBaseline: { type: Number, default: 0, min: 0 }
        }
      ],
      default: []
    }
  },
  { timestamps: true }
);

workboardLeaderboardSchema.index({ 'members.user': 1 });

module.exports = mongoose.model('WorkboardLeaderboard', workboardLeaderboardSchema);
