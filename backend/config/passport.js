const jwt = require('jsonwebtoken');
const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const User = require('../models/User');

const generateToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });

const getBackendUrl = () =>
  process.env.BACKEND_URL ||
  process.env.RENDER_EXTERNAL_URL ||
  `http://localhost:${process.env.PORT || 5000}`;

const buildGoogleCallbackUrl = () =>
  process.env.GOOGLE_CALLBACK_URL || `${getBackendUrl()}/api/auth/google/callback`;

const formatUsername = (value) => {
  const cleaned = (value || '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .trim()
    .slice(0, 24);

  if (!cleaned) {
    return 'Reader';
  }

  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
};

const buildUniqueUsername = async (profile, email) => {
  const emailPrefix = email.split('@')[0];
  const baseUsername = formatUsername(profile.displayName || emailPrefix);

  let candidate = baseUsername;
  let suffix = 1;

  while (await User.exists({ username: candidate })) {
    candidate = `${baseUsername}${suffix}`;
    suffix += 1;
  }

  return candidate;
};

const configurePassport = () => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.warn('Google OAuth is disabled because client credentials are missing.');
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: buildGoogleCallbackUrl()
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value?.toLowerCase();

          if (!email) {
            return done(new Error('Google account email is required.'));
          }

          let user = await User.findOne({
            $or: [{ googleId: profile.id }, { email }]
          });

          if (!user) {
            const username = await buildUniqueUsername(profile, email);
            user = await User.create({
              username,
              email,
              googleId: profile.id,
              authProvider: 'google'
            });
          } else {
            let shouldSave = false;

            if (!user.googleId) {
              user.googleId = profile.id;
              shouldSave = true;
            }

            if (user.authProvider !== 'google') {
              user.authProvider = 'google';
              shouldSave = true;
            }

            if (!user.username) {
              user.username = await buildUniqueUsername(profile, email);
              shouldSave = true;
            }

            if (shouldSave) {
              await user.save();
            }
          }

          return done(null, {
            token: generateToken(user._id),
            user
          });
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

module.exports = configurePassport;
