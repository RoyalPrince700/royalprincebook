/**
 * Per-leaderboard XP helpers.
 *
 * Each leaderboard stores its own XP baseline per participant (owner + members).
 * Leaderboard XP is always: max(0, user.workboardXp - baselineForThisBoard).
 * Multiple leaderboards never share baselines — each board document is isolated.
 */

const calculateLevel = (leaderboardXp, xpPerLevel = 500) =>
  Math.floor((leaderboardXp || 0) / xpPerLevel) + 1;

const calculateLeaderboardXp = (totalXp, xpBaseline = 0) =>
  Math.max(0, (totalXp || 0) - (xpBaseline || 0));

const getXpBaselineForUser = (leaderboard, userId) => {
  const uid = String(userId);

  if (uid === String(leaderboard.owner)) {
    return leaderboard.ownerXpBaseline ?? 0;
  }

  const member = (leaderboard.members || []).find((row) => String(row.user) === uid);
  return member?.xpBaseline ?? 0;
};

const buildParticipantRanking = (user, leaderboard, { getAvatarEmoji, defaultAvatarId, xpPerLevel }) => {
  const xpBaseline = getXpBaselineForUser(leaderboard, user._id);
  const leaderboardXp = calculateLeaderboardXp(user.workboardXp, xpBaseline);

  return {
    id: user._id,
    username: user.username,
    leaderboardXp,
    workboardXp: leaderboardXp,
    xpBaseline,
    level: calculateLevel(leaderboardXp, xpPerLevel),
    visitStreak: user.workboardVisitStreak || 0,
    longestStreak: user.workboardLongestStreak || 0,
    avatarId: user.workboardAvatar || defaultAvatarId,
    avatarEmoji: getAvatarEmoji(user.workboardAvatar),
    isOwner: String(user._id) === String(leaderboard.owner)
  };
};

const sortRankings = (rows) =>
  [...rows]
    .sort((a, b) => {
      if (b.leaderboardXp !== a.leaderboardXp) return b.leaderboardXp - a.leaderboardXp;
      if (b.visitStreak !== a.visitStreak) return b.visitStreak - a.visitStreak;
      return String(a.username).localeCompare(String(b.username));
    })
    .map((row, index) => ({ ...row, rank: index + 1 }));

module.exports = {
  calculateLevel,
  calculateLeaderboardXp,
  getXpBaselineForUser,
  buildParticipantRanking,
  sortRankings
};
