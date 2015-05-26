var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var swig = require('swig');
var dbConfig = require('./db');

var mongoose = require('mongoose');
mongoose.connect(dbConfig.url);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('twig', swig.renderFile);
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configuring Passport
var passport = require('passport');
var expressSession = require('express-session');
var MongoStore = require('connect-mongo')(expressSession);
app.use(expressSession({
  secret: 'mySecretKey',
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Using the flash middleware provided by connect-flash to store messages in session
// and displaying in templates
var flash = require('connect-flash');
app.use(flash());

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

var index = require('./routes/index');
var auth = require('./routes/auth')(passport);
var projectsApi = require('./routes/api/projects');
var ticketsApi = require('./routes/api/tickets');
var usersApi = require('./routes/api/users');


app.use('/', index);
app.use('/auth', auth);
app.use('/api/projects', projectsApi);
app.use('/api/tickets', ticketsApi);
app.use('/api/users', usersApi);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
