import passport from 'passport';
import passportLocal from 'passport-local';
import passportGoogle from 'passport-google-oauth20';
import User from '../models/user.model.js';
import { GOOGLE_CALLBACK_URL, GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET } from '../config/env.js';
import { Institute } from '../models/Institutions.model.js';


const LocalStrategry = passportLocal.Strategy;
const GoogleStrategy = passportGoogle.Strategy;

passport.use(
  'user-local',
  new LocalStrategry(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
          return done(null, false, { message: 'User not found' });
        }

        const isGoogleSignin = await User.findOne({
          _id: user._id,
          googleId: { $exists: true },
        });
        if (isGoogleSignin) {
          return done(null, false, {
            message: 'Email already signed in with google',
          });
        }

        // const isMatch = await bcrypt.compare(password, user.password);

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
          return done(null, false, { message: 'Incorrect Password' });
        }

        return done(null, {...user.toObject(), loginType: 'user'});
      } catch (err) {
        return done(err);
      }
    }
  )
);
passport.use(
  'institute-local',
  new LocalStrategry(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        const institiute = await Institute.findOne({ email }).select('+password');

        if (!institiute) {
          return done(null, false, { message: 'Institute not found' });
        }

        // const isGoogleSignin = await User.findOne({
        //   _id: user._id,
        //   googleId: { $exists: true },
        // });
        // if (isGoogleSignin) {
        //   return done(null, false, {
        //     message: 'Email already signed in with google',
        //   });
        // }

        // const isMatch = await bcrypt.compare(password, user.password);

        const isMatch = await institiute.comparePassword(password);
        if (!isMatch) {
          return done(null, false, { message: 'Incorrect Password' });
        }

        return done(null, {...institiute.toObject(), loginType: 'institute'});
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: GOOGLE_OAUTH_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          const existingUser = await User.findOne({
            email: profile.emails[0].value,
          });

          if (existingUser) {
            // return done(null, false, { message: "Existing local account found. Do you want to link it with Google?" });
            const updatedUser = await User.findOneAndUpdate(
              { email: existingUser.email },
              { googleId: profile.id }
            );
            return done(
              null,
              updatedUser,
              `google sign in set for ${profile.emails[0].value}`
            );
          } else {
            user = new User({
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
            });

            await user.save();

            return done(null, user, 'new user created');
          }
        }
        return done(null, {...user.toObject, loginType: 'user'});
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((entity, done) => {
  done(null, { id: entity._id, loginType: entity.loginType}); // Save only user ID in session
});

passport.deserializeUser(async (obj, done) => {
  try {
    if(obj.loginType==='user'){
      const user = await User.findById(obj.id);
      done(null,  user ? { ...user.toObject(), loginType: 'user' } : false);
    }
    else{
      const institiute = await Institute.findById(obj.id);
      done(null,  institiute ? { ...institiute.toObject(), loginType: 'institute' } : false);
    }
  } catch (err) {
    done(err);
  }
});
export default passport;
