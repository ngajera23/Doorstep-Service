var express = require('express');
var router = express.Router();
var passport = require('passport');
const User = require('../models/user');
const Jobs = require('../models/job');
var authorizeUser = require('../middlewares/auth');

const EMPLOYER = 0
const WORKER = 1

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('main', { title: 'Welcome!' });
});

/* GET login page. */
router.get('/login', function (req, res, next) {

  if (req.user) {
    if (req.user.role == EMPLOYER) {
      res.redirect('/employer_jobs');
    } else if (req.user.role == WORKER) {
      res.redirect('/worker_jobs');
    }
  }

  res.render('login', { title: 'Login' });
})

/* GET register page. */
router.get('/signup', function (req, res, next) {
  if (req.user) {
    if (req.user.role == EMPLOYER) {
      res.redirect('/employer_jobs');
    } else if (req.user.role == WORKER) {
      res.redirect('/worker_jobs');
    }
  }

  res.render('signup', { title: 'Register' });
})

/* POST LOGIN */
router.post('/login', passport.authenticate('local-login', {
  failureRedirect: '/login',
  failureFlash: true
}), function (req, res) {
  if (req.user.role == EMPLOYER) {
    res.redirect('/employer_jobs');
  } else {
    res.redirect('/worker_jobs');
  }
});

/* POST REGISTER */
router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/home',
  failureRedirect: '/signup',
  failureFlash: true
}));

/* GET USer profile */
router.get('/profile', authorizeUser, function (req, res, next) {
  if (!req.user.skills) {
    req.user.skills = "";
  }
  res.render('user_profile', { title: 'Profile', user: req.user, image: "https://picsum.photos/200" });
})

/* GET logout. */
router.get('/logout', function (req, res, next) {
  req.logOut();
  res.redirect('/');
})

module.exports = router;
