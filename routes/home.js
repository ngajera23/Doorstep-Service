var express = require('express');
var router = express.Router();
const User = require('../models/user');
const Jobs = require('../models/job');
const JobWorker = require('../models/jobWorker');
const Reviews = require('../models/reviews');
var authorizeUser = require('../middlewares/auth');

const EMPLOYER = 0
const WORKER = 1

/* GET home page. */
router.get('/home', authorizeUser, function (req, res, next) {
  res.render('home', { title: 'Home', user: req.user });
});

/* GET employer jobs page. */
router.get('/employer_jobs', authorizeUser, async function (req, res, next) {

  if (req.user.role == WORKER) {
    res.redirect('/worker_jobs');
  }

  const emp_jobs = await Jobs.find({ user: req.user._id });

  res.render('employer_jobs', {
    title: 'Employer Jobs',
    user: req.user,
    emp_jobs: emp_jobs
  });
})

/* GET worker jobs page */
router.get('/worker_jobs', authorizeUser, async function (req, res, next) {

  if (req.user.role == EMPLOYER) {
    res.redirect('/employer_jobs');
  }

  const all_jobs = await Jobs.find({});

  res.render('worker_jobs', {
    title: 'Worker Jobs',
    user: req.user,
    all_jobs: all_jobs,
  });
});

/* GET create job page */
router.get('/create_job', authorizeUser, async function (req, res, next) {

  if (req.user.role == WORKER) {
    res.redirect('/worker_jobs');
  }

  res.render('create_job', { title: 'Create Job', user: req.user });
})

/* POST add job */
router.post('/create_job', authorizeUser, async function (req, res, next) {
  var job = new Jobs({
    title: req.body.title,
    description: req.body.description,
    location: req.body.location,
    salary: req.body.salary,
    employer: req.user._id
  });
  await job.save();
  res.redirect('/employer_jobs');
});

/* APPLY for a job */
router.post('/apply_job', authorizeUser, async function (req, res, next) {

  if (req.user.role == EMPLOYER) {
    res.redirect('/employer_jobs');
  }

  const job = await Jobs.findById(req.body.job_id);
  const jobWorker = new JobWorker({
    job: job._id,
    worker: req.user._id
  });
  await jobWorker.save();
  res.redirect('/worker_jobs');
});

/* GET Applied jobs */
router.get('/applied_jobs', authorizeUser, async function (req, res, next) {
  if (req.user.role == EMPLOYER) {
    res.redirect('/employer_jobs');
  }

  const applied_jobs = (await JobWorker.find({ worker: req.user._id }, { job: 1, _id: 0 })).map(job => job.job);
  const all_jobs = await Jobs.find({ _id: { $in: applied_jobs } });
  res.render('applied_jobs', { title: 'Applied Jobs', user: req.user, all_jobs: all_jobs });
});

/* DELETE JOb */
router.delete('/delete_job/:id', authorizeUser, async function (req, res, next) {
  await Jobs.findByIdAndDelete(req.params.id);
  await JobWorker.deleteMany({ job: req.params.id });
  res.sendStatus(200);
});

/* GET Job details */
router.get('/job_details/:id', authorizeUser, async function (req, res, next) {

  if (req.user.role == WORKER) {
    res.redirect('/worker_jobs');
  }

  const job = await Jobs.findById(req.params.id);

  if (!job) {
    res.redirect('/employer_jobs');
  }

  const job_workers = (await JobWorker.find({ job: req.params.id }, { worker: 1, _id: 0 })).map(worker => worker.worker);
  const workers = await User.find({ _id: { $in: job_workers } });
  res.render('job_details', { title: 'Job Details', user: req.user, job: job, workers: workers });
});



module.exports = router;