const WorkboardLeaderboard = require('../models/WorkboardLeaderboard');
const WorkboardLeaderboardInvite = require('../models/WorkboardLeaderboardInvite');
const User = require('../models/User');
const { XP_PER_LEVEL } = require('../utils/workboardAchievements');
const {
  DEFAULT_AVATAR_ID,
  getAvatarEmoji,
  isValidAvatarId,
  WORKBOARD_AVATARS
} = require('../utils/workboardAvatars');
const {
  buildParticipantRanking,
  sortRankings
} = require('../utils/workboardLeaderboardXp');

const { sendLeaderboardInviteEmail } = require('../mailtrap/emails');

const USER_RANK_FIELDS =
  'username workboardXp workboardVisitStreak workboardLongestStreak workboardAvatar';

const hydrateMissingBaselines = async (leaderboard) => {
  const doc = await WorkboardLeaderboard.findById(leaderboard._id);
  if (!doc) return leaderboard;

  let dirty = false;

  for (const member of doc.members) {
    if (member.xpBaseline != null) continue;

    const acceptedInvite = await WorkboardLeaderboardInvite.findOne({
      leaderboard: doc._id,
      invitedUser: member.user,
      status: 'accepted'
    })
      .sort({ updatedAt: -1 })
      .select('xpBaseline');

    if (acceptedInvite?.xpBaseline != null) {
      member.xpBaseline = acceptedInvite.xpBaseline;
      dirty = true;
    }
  }

  if (dirty) {
    await doc.save();
  }

  return doc.toObject();
};

const isMemberOrOwner = (leaderboard, userId) => {
  const uid = String(userId);
  if (String(leaderboard.owner) === uid) return true;
  return leaderboard.members.some((row) => String(row.user) === uid);
};

const buildRankings = async (leaderboard) => {
  const hydrated = await hydrateMissingBaselines(leaderboard);

  const memberIds = [
    hydrated.owner,
    ...hydrated.members.map((row) => row.user)
  ];

  const uniqueIds = [...new Set(memberIds.map((id) => String(id)))];
  const users = await User.find({ _id: { $in: uniqueIds } }).select(USER_RANK_FIELDS).lean();

  const rankings = sortRankings(
    users.map((user) =>
      buildParticipantRanking(user, hydrated, {
        getAvatarEmoji,
        defaultAvatarId: DEFAULT_AVATAR_ID,
        xpPerLevel: XP_PER_LEVEL
      })
    )
  );

  return rankings;
};

const listLeaderboards = async (req, res) => {
  try {
    const userId = req.user._id;

    const [owned, joined, pendingInvites] = await Promise.all([
      WorkboardLeaderboard.find({ owner: userId }).sort({ updatedAt: -1 }).lean(),
      WorkboardLeaderboard.find({
        owner: { $ne: userId },
        'members.user': userId
      })
        .populate('owner', 'username workboardAvatar')
        .sort({ updatedAt: -1 })
        .lean(),
      WorkboardLeaderboardInvite.find({ invitedUser: userId, status: 'pending' })
        .populate('leaderboard', 'name owner')
        .populate('invitedBy', 'username workboardAvatar')
        .sort({ createdAt: -1 })
        .lean()
    ]);

    res.json({
      owned: owned.map((row) => ({
        id: row._id,
        name: row.name,
        memberCount: row.members.length + 1,
        isOwner: true,
        updatedAt: row.updatedAt
      })),
      joined: joined.map((row) => ({
        id: row._id,
        name: row.name,
        memberCount: row.members.length + 1,
        isOwner: false,
        owner: row.owner
          ? {
              id: row.owner._id,
              username: row.owner.username,
              avatarEmoji: getAvatarEmoji(row.owner.workboardAvatar)
            }
          : null,
        updatedAt: row.updatedAt
      })),
      pendingInvites: pendingInvites.map((row) => ({
        id: row._id,
        status: row.status,
        createdAt: row.createdAt,
        leaderboard: row.leaderboard
          ? { id: row.leaderboard._id, name: row.leaderboard.name }
          : null,
        invitedBy: row.invitedBy
          ? {
              id: row.invitedBy._id,
              username: row.invitedBy.username,
              avatarEmoji: getAvatarEmoji(row.invitedBy.workboardAvatar)
            }
          : null
      }))
    });
  } catch (error) {
    console.error('List leaderboards error:', error);
    res.status(500).json({ message: 'Failed to load leaderboards' });
  }
};

const createLeaderboard = async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    if (!name) {
      return res.status(400).json({ message: 'Leaderboard name is required' });
    }

    const owner = await User.findById(req.user._id).select('workboardXp');

    const leaderboard = await WorkboardLeaderboard.create({
      name,
      owner: req.user._id,
      ownerXpBaseline: owner?.workboardXp || 0,
      members: []
    });

    const rankings = await buildRankings(leaderboard);

    res.status(201).json({
      id: leaderboard._id,
      name: leaderboard.name,
      isOwner: true,
      memberCount: 1,
      rankings
    });
  } catch (error) {
    console.error('Create leaderboard error:', error);
    res.status(500).json({ message: 'Failed to create leaderboard' });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await WorkboardLeaderboard.findById(req.params.id).lean();
    if (!leaderboard) {
      return res.status(404).json({ message: 'Leaderboard not found' });
    }

    if (!isMemberOrOwner(leaderboard, req.user._id)) {
      return res.status(403).json({ message: 'You are not a member of this leaderboard' });
    }

    const owner = await User.findById(leaderboard.owner).select(USER_RANK_FIELDS).lean();
    const rankings = await buildRankings(leaderboard);

    res.json({
      id: leaderboard._id,
      name: leaderboard.name,
      isOwner: String(leaderboard.owner) === String(req.user._id),
      owner: owner
        ? {
            id: owner._id,
            username: owner.username,
            avatarEmoji: getAvatarEmoji(owner.workboardAvatar)
          }
        : null,
      memberCount: rankings.length,
      rankings
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ message: 'Failed to load leaderboard' });
  }
};

const deleteLeaderboard = async (req, res) => {
  try {
    const leaderboard = await WorkboardLeaderboard.findById(req.params.id);
    if (!leaderboard) {
      return res.status(404).json({ message: 'Leaderboard not found' });
    }

    if (String(leaderboard.owner) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Only the owner can delete this leaderboard' });
    }

    await Promise.all([
      WorkboardLeaderboardInvite.deleteMany({ leaderboard: leaderboard._id }),
      leaderboard.deleteOne()
    ]);

    res.json({ message: 'Leaderboard deleted' });
  } catch (error) {
    console.error('Delete leaderboard error:', error);
    res.status(500).json({ message: 'Failed to delete leaderboard' });
  }
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inviteToLeaderboard = async (req, res) => {
  try {
    const leaderboard = await WorkboardLeaderboard.findById(req.params.id);
    if (!leaderboard) {
      return res.status(404).json({ message: 'Leaderboard not found' });
    }

    if (!isMemberOrOwner(leaderboard, req.user._id)) {
      return res.status(403).json({ message: 'You are not a member of this leaderboard' });
    }

    const email = String(req.body.email || '').trim().toLowerCase();
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ message: 'Enter a valid email address' });
    }

    const invitedUser = await User.findOne({
      email,
      isActive: { $ne: false }
    }).select('_id username email workboardAvatar workboardXp');

    if (!invitedUser) {
      return res.status(404).json({ message: 'No account found with that email address' });
    }

    if (String(invitedUser._id) === String(req.user._id)) {
      return res.status(400).json({ message: 'You cannot invite yourself' });
    }

    if (isMemberOrOwner(leaderboard, invitedUser._id)) {
      return res.status(400).json({ message: 'This user is already in the leaderboard' });
    }

    const existingInvite = await WorkboardLeaderboardInvite.findOne({
      leaderboard: leaderboard._id,
      invitedUser: invitedUser._id
    });

    if (existingInvite?.status === 'pending') {
      return res.status(400).json({ message: 'An invite is already pending for this user' });
    }

    const inviteeXpBaseline = invitedUser.workboardXp || 0;

    const invite =
      existingInvite ||
      (await WorkboardLeaderboardInvite.create({
        leaderboard: leaderboard._id,
        invitedUser: invitedUser._id,
        invitedBy: req.user._id,
        status: 'pending',
        xpBaseline: inviteeXpBaseline
      }));

    if (existingInvite && existingInvite.status !== 'pending') {
      existingInvite.status = 'pending';
      existingInvite.invitedBy = req.user._id;
      existingInvite.xpBaseline = inviteeXpBaseline;
      await existingInvite.save();
    } else if (existingInvite?.status === 'pending') {
      existingInvite.xpBaseline = inviteeXpBaseline;
      await existingInvite.save();
    }

    sendLeaderboardInviteEmail({
      invitedUser,
      inviter: req.user,
      leaderboardName: leaderboard.name
    }).catch((error) => {
      console.error('Leaderboard invite email error:', error.message);
    });

    res.status(201).json({
      message: 'Invite sent',
      invite: {
        id: invite._id,
        status: invite.status,
        invitedUser: {
          id: invitedUser._id,
          username: invitedUser.username,
          email: invitedUser.email,
          avatarEmoji: getAvatarEmoji(invitedUser.workboardAvatar)
        }
      }
    });
  } catch (error) {
    console.error('Invite to leaderboard error:', error);
    res.status(500).json({ message: 'Failed to send invite' });
  }
};

const respondToInvite = async (req, res) => {
  try {
    const action = String(req.body.action || '').toLowerCase();
    if (!['accept', 'decline'].includes(action)) {
      return res.status(400).json({ message: 'Action must be accept or decline' });
    }

    const invite = await WorkboardLeaderboardInvite.findById(req.params.id);
    if (!invite) {
      return res.status(404).json({ message: 'Invite not found' });
    }

    if (String(invite.invitedUser) !== String(req.user._id)) {
      return res.status(403).json({ message: 'This invite is not for you' });
    }

    if (invite.status !== 'pending') {
      return res.status(400).json({ message: 'This invite has already been handled' });
    }

    if (action === 'decline') {
      invite.status = 'declined';
      await invite.save();
      return res.json({ message: 'Invite declined' });
    }

    const leaderboard = await WorkboardLeaderboard.findById(invite.leaderboard);
    if (!leaderboard) {
      invite.status = 'declined';
      await invite.save();
      return res.status(404).json({ message: 'Leaderboard no longer exists' });
    }

    if (!isMemberOrOwner(leaderboard, req.user._id)) {
      const memberBaseline =
        invite.xpBaseline ??
        (await User.findById(req.user._id).select('workboardXp'))?.workboardXp ??
        0;

      const updated = await WorkboardLeaderboard.findOneAndUpdate(
        {
          _id: leaderboard._id,
          'members.user': { $ne: req.user._id }
        },
        {
          $push: {
            members: {
              user: req.user._id,
              joinedAt: new Date(),
              xpBaseline: memberBaseline
            }
          }
        },
        { new: true }
      );

      if (!updated) {
        return res.status(400).json({ message: 'You are already in this leaderboard' });
      }
    }

    invite.status = 'accepted';
    await invite.save();

    const freshLeaderboard = await WorkboardLeaderboard.findById(invite.leaderboard).lean();
    const rankings = await buildRankings(freshLeaderboard);

    res.json({
      message: 'Invite accepted',
      leaderboard: {
        id: leaderboard._id,
        name: leaderboard.name,
        rankings
      }
    });
  } catch (error) {
    console.error('Respond to invite error:', error);
    res.status(500).json({ message: 'Failed to respond to invite' });
  }
};

const listAvatars = (_req, res) => {
  res.json({ avatars: WORKBOARD_AVATARS, defaultAvatarId: DEFAULT_AVATAR_ID });
};

const updateWorkboardAvatar = async (req, res) => {
  try {
    const avatarId = String(req.body.avatarId || '').trim();
    if (!isValidAvatarId(avatarId)) {
      return res.status(400).json({ message: 'Invalid avatar selection' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { workboardAvatar: avatarId },
      { new: true }
    ).select('username email role workboardXp workboardAvatar');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Avatar updated',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        workboardXp: user.workboardXp || 0,
        workboardAvatar: user.workboardAvatar,
        avatarEmoji: getAvatarEmoji(user.workboardAvatar)
      }
    });
  } catch (error) {
    console.error('Update workboard avatar error:', error);
    res.status(500).json({ message: 'Failed to update avatar' });
  }
};

module.exports = {
  listLeaderboards,
  createLeaderboard,
  getLeaderboard,
  deleteLeaderboard,
  inviteToLeaderboard,
  respondToInvite,
  listAvatars,
  updateWorkboardAvatar
};
