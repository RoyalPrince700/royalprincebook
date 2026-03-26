const express = require('express');
const router = express.Router();
const {
  googleAuth,
  googleAuthCallback,
  getProfile,
  updateProfile,
  getAllUsers,
  updateUserRole
} = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.get('/google', googleAuth);
router.get('/google/callback', googleAuthCallback);

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);

// Admin routes
router.get('/users', authenticateToken, getAllUsers);
router.put('/users/:id/role', authenticateToken, updateUserRole);

module.exports = router;