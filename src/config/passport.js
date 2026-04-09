const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
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
          const user = await User.findByEmail(email.toLowerCase());

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
          let user = await User.findByGoogleId(profile.id);

          if (!user) {
            user = new User({
              googleId: profile.id,
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
              email: profile.emails[0].value,
              avatar: profile.photos[0]?.value,
              isVerified: true,
            });
            await user.save();
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Facebook OAuth Strategy
  passport.use(
    'facebook',
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL,
        profileFields: ['id', 'displayName', 'email', 'picture'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findByFacebookId(profile.id);

          if (!user) {
            const [firstName, lastName] = profile.displayName.split(' ');
            user = new User({
              facebookId: profile.id,
              firstName: firstName || 'Facebook',
              lastName: lastName || 'User',
              email: profile.emails?.[0]?.value,
              avatar: profile.photos?.[0]?.value,
              isVerified: true,
            });
            await user.save();
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
      const user = await User.findByEmail(email);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};

module.exports = configurePassport;
