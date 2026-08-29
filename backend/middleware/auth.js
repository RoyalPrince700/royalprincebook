const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid or inactive user' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admins only' });
  }
};

const authorizeAdminOrSuperior = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'superior')) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Taskboard access required' });
  }
};

const canEditWorkboard = (user) => Boolean(user && user.isActive !== false);

const optionalAuthenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      req.user = null;
      return next();
    }

    req.user = user;
    return next();
  } catch (_error) {
    req.user = null;
    return next();
  }
};

module.exports = {
  authenticateToken,
  authorizeAdmin,
  authorizeAdminOrSuperior,
  canEditWorkboard,
  optionalAuthenticateToken
};