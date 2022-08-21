var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

module.exports = function (passport) {
  // Login
  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, function (req, email, password, done) {
    if (email) {
      email = email.toLowerCase();
    }

    process.nextTick(function () {
      User.findOne({ 'local.email': email }, function (err, user) {
        if (err) {
          return done(err);
        }

        if (!user) {
          return done(null, false, req.flash('loginMessage', 'User not found'));
        }

        if (!user.validatePassword(password)) {
          return done(null, false, req.flash('loginMessage', 'Wrong credentials'));
        } else {
          return done(null, user);
        }
      });
    });
  }));

  // Signup
  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, function (req, email, password, done) {

    process.nextTick(function () {
      if (!req.user) {
        User.findOne({ 'local.email': email.toLowerCase() }, async function (err, user) {
          if (err) {
            console.log(err);
            return done(err);
          }

          const { first_name, last_name, role, skills } = req.body;

          if (user) {
            return done(null, false, req.flash('signupMessage', 'Error! the email is already taken.'));
          } else {
            var newUser = new User();

            if (!(first_name.trim() && last_name.trim())) {
              return done(null, false, req.flash('signupMessage', 'Error! All fields are required.'));
            }

            newUser.local.firstName = first_name;
            newUser.local.lastName = last_name;
            newUser.local.email = email.toLowerCase();
            newUser.local.password = newUser.generateHash(password);
            newUser.skills = skills;
            newUser.role = role;

            try {
              await newUser.save();
              return done(null, newUser);
            } catch (err) {
              return done(null, false, req.flash('signupMessage', 'Error! Something went wrong.'));
            }
          }
        });
      } else {
        return done(null, req.user);
      }
    });
  }));

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
