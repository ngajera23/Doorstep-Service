var express = require('express');
var router = express.Router();
var passport = require('passport');
const User = require('../models/user');
const Jobs = require('../models/job');
const ContactUs = require('../models/contact_us');
var authorizeUser = require('../middlewares/auth');

const EMPLOYER = 0
const WORKER = 1

/* GET home page. */
router.get('/', async function (req, res, next) {
  const all_jobs = await Jobs.find({});
  res.render('main', { title: 'Welcome to the project!', all_jobs: all_jobs });
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

  res.render('login', { title: 'Login', message: req.flash('message') });
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

  res.render('signup', { title: 'Register', message: req.flash('message') });
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

/* GET Contact us page. */
router.get('/contact', function (req, res, next) {
  res.render('contact', { title: 'Contact us' });
})

/* Post Contact us page. */
router.post('/contact', async function (req, res, next) {
  const { name, email, description, title } = req.body;

  if (!name || !email || !description || !title) {
    res.render('contact', { message: 'All fields are required' });
  }

  const contact_us = new ContactUs({
    name: name,
    email: email,
    description: description,
    title: title
  });

  await contact_us.save();
  res.render('contact', { message: 'Your message has been sent!' });
})


module.exports = router;
