const passport = require('passport');
const User = require('../models/User');

const getFrontendUrl = () => {
  const isProdLike =
    process.env.NODE_ENV === 'production' ||
    !!process.env.RENDER_EXTERNAL_URL ||
    !!process.env.RENDER ||
    !!process.env.VERCEL;

  return (
    process.env.FRONTEND_URL ||
    (isProdLike ? 'https://www.jubiac.com' : 'http://localhost:5173')
  );
};

const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: false
});

const googleAuthCallback = (req, res, next) => {
  const frontendUrl = getFrontendUrl();

  passport.authenticate('google', { session: false }, (err, data) => {
    if (err) {
      console.error('[Auth] Google Auth Error:', err);
      return res.redirect(`${frontendUrl}/login?error=auth_failed`);
    }

    if (!data || !data.token) {
      console.error('[Auth] No token returned from Google auth flow.');
      return res.redirect(`${frontendUrl}/login?error=no_token`);
    }

    return res.redirect(
      `${frontendUrl}/auth/callback?token=${encodeURIComponent(data.token)}`
    );
  })(req, res, next);
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        purchasedBooks: user.purchasedBooks || []
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
    const { username, email } = req.body;
    const userId = req.user._id;

    // Check if new email/username is already taken
    const existingUser = await User.findOne({
      $and: [
        { _id: { $ne: userId } },
        { $or: [{ email }, { username }] }
      ]
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'Email or username already taken'
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { username, email },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        purchasedBooks: user.purchasedBooks || []
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