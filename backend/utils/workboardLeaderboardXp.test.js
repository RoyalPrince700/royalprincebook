const assert = require('assert');
const {
  calculateLeaderboardXp,
  getXpBaselineForUser,
  sortRankings
} = require('./workboardLeaderboardXp');

const userId = 'user-a';

const boards = [
  { _id: 'lb-1', owner: userId, ownerXpBaseline: 1000, members: [] },
  {
    _id: 'lb-2',
    owner: 'other',
    ownerXpBaseline: 0,
    members: [{ user: userId, xpBaseline: 1500 }]
  },
  { _id: 'lb-3', owner: userId, ownerXpBaseline: 2000, members: [] },
  {
    _id: 'lb-4',
    owner: 'other-2',
    ownerXpBaseline: 0,
    members: [{ user: userId, xpBaseline: 2200 }]
  },
  { _id: 'lb-5', owner: userId, ownerXpBaseline: 2500, members: [] }
];

const currentTotalXp = 3000;

const expectedByBoard = {
  'lb-1': 2000,
  'lb-2': 1500,
  'lb-3': 1000,
  'lb-4': 800,
  'lb-5': 500
};

for (const board of boards) {
  const baseline = getXpBaselineForUser(board, userId);
  const leaderboardXp = calculateLeaderboardXp(currentTotalXp, baseline);
  assert.strictEqual(
    leaderboardXp,
    expectedByBoard[board._id],
    `board ${board._id} should be isolated`
  );
}

const ranked = sortRankings(
  boards.map((board) => ({
    username: `board-${board._id}`,
    leaderboardXp: calculateLeaderboardXp(
      currentTotalXp,
      getXpBaselineForUser(board, userId)
    ),
    visitStreak: 0
  }))
);

assert.strictEqual(ranked[0].leaderboardXp, 2000);
assert.strictEqual(ranked[ranked.length - 1].leaderboardXp, 500);

console.log('workboardLeaderboardXp: multi-board isolation checks passed');
