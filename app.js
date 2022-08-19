var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressHandlebars = require('express-handlebars');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo');
const Handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
var passport = require('passport');
const DB_URL = 'mongodb://localhost:27017/my-web-project';

// ---------------------------- import routers -------------------------
var indexRouter = require('./routes/index');
var homeRouter = require('./routes/home');

var app = express();

// ---------------------------- view engine setup -------------------------
var hbs = expressHandlebars.create({
  extname: '.handlebars',
  layoutsDir: path.join(__dirname, '/views/pages'),
  partialsDir: [
    path.join(__dirname, '/views/partials'),
  ],
  handlebars: allowInsecurePrototypeAccess(Handlebars)
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views/pages'));

// Disable layouts for all pages so that we can render html directly
app.locals.layout = false;

// ------------------------ middleware ------------------------
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// ------------------------ database ------------------------
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('error', function () {
  console.error("Could not connect to database");
});

// ------------------------ session ------------------------
// Passport configuration
require('./utils/passport')(passport);

// required for passport secret for session
app.use(session({
  secret: 'my-secret-text',
  saveUninitialized: true,
  resave: true,
  //store session on MongoDB using express-session + connect mongo,
  store: MongoStore.create({
    mongoUrl: DB_URL,
    collectionName: 'sessions'
  }),
}));

// Init passport authentication
app.use(passport.initialize());
// persistent login sessions
app.use(passport.session());



// ----------------------------- routes -----------------------------
app.use('/', indexRouter);
app.use('/', homeRouter);

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// ------------------------------ start server ------------------------------
app.set('port', process.env.PORT || 3000);
let server = app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + server.address().port);
});
