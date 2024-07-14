const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/authModel');


// Configure the Google strategy for use by Passport.
passport.use(new GoogleStrategy({
    clientID: '527887456886-i5q16hn3ksghe2scp92m8n7gfrb59ldt.apps.googleusercontent.com',
    clientSecret:'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',
    callbackURL: 'http://localhost:5001/auth/google/callback'  // Update this to match the route
  },
  (accessToken, refreshToken, profile, done) => {
    User.findOne({ googleId: profile.id }).then((existingUser) => {
      if (existingUser) {
        existingUser.accessToken = accessToken;
        existingUser.save().then(user => done(null, user));
      } else {
        new User({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          accessToken: accessToken,
        }).save().then(user => done(null, user));
      }
    });
  }));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});