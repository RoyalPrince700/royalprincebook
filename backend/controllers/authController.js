const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getAvatarEmoji, isValidAvatarId } = require('../utils/workboardAvatars');
const { expandBookAccessIds } = require('../utils/bookAliases');
const { isValidDesktopPort, signDesktopState, readDesktopPort } = require('../utils/desktopAuthState');

const DESKTOP_TOKEN_EXPIRES_IN = '30d';

const getFrontendUrl = () => {
  const isProdLike =
    process.env.NODE_ENV === 'production' ||
    !!process.env.RENDER_EXTERNAL_URL ||
    !!process.env.RENDER ||
    !!process.env.VERCEL;

  return (
    process.env.FRONTEND_URL ||
    (isProdLike ? 'https://www.royalprincehub.com' : 'http://localhost:5173')
  );
};

const desktopCallbackUrl = (port, params) => {
  const query = new URLSearchParams(params).toString();
  return `http://127.0.0.1:${port}/callback?${query}`;
};

const issueDesktopToken = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded?.userId) {
    throw new Error('Desktop token is missing a user id');
  }

  return jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET, {
    expiresIn: DESKTOP_TOKEN_EXPIRES_IN
  });
};

const googleAuth = (req, res, next) => {
  const options = {
    scope: ['profile', 'email'],
    session: false
  };

  if (req.query.desktop_port !== undefined) {
    const desktopPort = Number(req.query.desktop_port);
    if (!isValidDesktopPort(desktopPort)) {
      return res.status(400).json({ message: 'Invalid desktop port' });
    }

    try {
      options.state = signDesktopState(desktopPort);
    } catch (error) {
      console.error('[Auth] Desktop sign-in could not start:', error.message);
      return res.status(500).json({ message: 'Desktop sign-in is not available' });
    }
  }

  return passport.authenticate('google', options)(req, res, next);
};

const googleAuthCallback = (req, res, next) => {
  const frontendUrl = getFrontendUrl();
  const desktopPort = readDesktopPort(req.query.state);

  const redirectToLogin = (errorCode) => {
    if (desktopPort) {
      return res.redirect(desktopCallbackUrl(desktopPort, { error: errorCode }));
    }
    return res.redirect(`${frontendUrl}/login?error=${errorCode}`);
  };

  passport.authenticate('google', { session: false }, (err, data) => {
    if (err) {
      console.error('[Auth] Google Auth Error:', err);
      return redirectToLogin('auth_failed');
    }

    if (!data || !data.token) {
      console.error('[Auth] No token returned from Google auth flow.');
      return redirectToLogin('no_token');
    }

    if (desktopPort) {
      try {
        const desktopToken = issueDesktopToken(data.token);
        return res.redirect(desktopCallbackUrl(desktopPort, { token: desktopToken }));
      } catch (error) {
        console.error('[Auth] Desktop token error:', error.message);
        return redirectToLogin('auth_failed');
      }
    }

    return res.redirect(
      `${frontendUrl}/auth/callback?token=${encodeURIComponent(data.token)}`
    );
  })(req, res, next);
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('purchasedBooks', 'title');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const purchasedBooks = expandBookAccessIds(
      (user.purchasedBooks || []).map((book) => book._id),
      user.purchasedBooks || []
    );

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        purchasedBooks,
        workboardXp: user.workboardXp || 0,
        workboardAvatar: user.workboardAvatar || 'royal-crown',
        avatarEmoji: getAvatarEmoji(user.workboardAvatar)
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { username, email, workboardAvatar } = req.body;
    const userId = req.user._id;

    const orClauses = [];
    if (email) orClauses.push({ email });
    if (username) orClauses.push({ username });

    if (orClauses.length) {
      const existingUser = await User.findOne({
        $and: [{ _id: { $ne: userId } }, { $or: orClauses }]
      });

      if (existingUser) {
        return res.status(400).json({
          message: 'Email or username already taken'
        });
      }
    }

    const updates = {};
    if (username != null) updates.username = username;
    if (email != null) updates.email = email;
    if (workboardAvatar != null) {
      if (!isValidAvatarId(workboardAvatar)) {
        return res.status(400).json({ message: 'Invalid avatar selection' });
      }
      updates.workboardAvatar = workboardAvatar;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true, runValidators: true }
    ).populate('purchasedBooks', 'title');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const purchasedBooks = expandBookAccessIds(
      (user.purchasedBooks || []).map((book) => book._id),
      user.purchasedBooks || []
    );

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        purchasedBooks,
        workboardXp: user.workboardXp || 0,
        workboardAvatar: user.workboardAvatar || 'royal-crown',
        avatarEmoji: getAvatarEmoji(user.workboardAvatar)
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user role (Admin only)
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const { id } = req.params;
    const adminId = req.user._id;

    if (!['user', 'admin', 'superior', 'webdev_student'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Check if requester is admin (double check, though middleware should handle this)
    const admin = await User.findById(adminId);
    if (admin.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User role updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Role update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all users (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const adminId = req.user._id;
    const admin = await User.findById(adminId);
    
    if (admin.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  googleAuth,
  googleAuthCallback,
  getProfile,
  updateProfile,
  updateUserRole,
  getAllUsers
};