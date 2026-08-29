const jwt = require('jsonwebtoken');

// Productivity apps (taskboard/noteboard): 3d keeps users signed in across work sessions
// without leaving tokens valid too long. Override via JWT_EXPIRES_IN in .env.
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '3d';

const generateToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });

module.exports = {
  JWT_EXPIRES_IN,
  generateToken
};
