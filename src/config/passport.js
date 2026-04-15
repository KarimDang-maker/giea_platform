const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const userRepository = require('../modules/authentication/repositories/user.repository');
const User = require('../modules/authentication/models/user.model');

const configurePassport = (passport) => {
  // Local Strategy for email/password login
  passport.use(
    'local',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async (email, password, done) => {
        try {
          const user = await userRepository.findByEmail(email.toLowerCase());

          if (!user) {
            return done(null, false, { message: 'User not found' });
          }

          const isValidPassword = await user.comparePassword(password);

          if (!isValidPassword) {
            return done(null, false, { message: 'Invalid password' });
          }

          if (!user.isVerified) {
            return done(null, false, { message: 'Please verify your email first' });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Google OAuth Strategy
  passport.use(
    'google',
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await userRepository.findByGoogleId(profile.id);

          if (!user) {
            // Check if email already exists
            const email = profile.emails[0]?.value;
            if (email) {
              const existingUser = await userRepository.findByEmail(email);
              if (existingUser) {
                // Link Google ID to existing user
                user = await userRepository.update(existingUser.email, {
                  googleId: profile.id,
                });
              } else {
                // Create new user from Google profile
                const newUser = new User({
                  googleId: profile.id,
                  firstName: profile.name.givenName || 'User',
                  lastName: profile.name.familyName || '',
                  email: email,
                  avatar: profile.photos[0]?.value || '',
                  isVerified: true,
                  emailVerifiedAt: new Date(),
                });
                user = await userRepository.create(newUser);
              }
            }
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Serialize user (store ID in session)
  passport.serializeUser((user, done) => {
    done(null, user.email);
  });

  // Deserialize user (fetch user from ID)
  passport.deserializeUser(async (email, done) => {
    try {
      const user = await userRepository.findByEmail(email);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};

module.exports = configurePassport;
