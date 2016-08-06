require('dotenv').config({ silent: true });

var express = require('express');
var mongoose = require("mongoose");
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var subdomain = require('wildcard-subdomains');

var dashboard = require('./routes/dashboard');
var routes = require('./routes/index');
var plansRoutes = require('./routes/plans');
var users = require('./routes/users');
var partials = require('./routes/partials');

var User = require('./models/user');

var app = express();

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;
mongoose.connect(process.env.MONGODB_URI); // connect to our database

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/users')));
app.use('/js', express.static(__dirname + '/node_modules/remodal/dist'));
app.use('/js', express.static(__dirname + '/node_modules/angular'));
app.use('/js', express.static(__dirname + '/node_modules/angular-route'));
app.use('/js', express.static(__dirname + '/node_modules/ngstorage'));
app.use('/js', express.static(__dirname + '/node_modules/angular-sanitize'));
app.use('/js', express.static(__dirname + '/node_modules/angular-ui-bootstrap/dist'));
app.use('/js', express.static(__dirname + '/public/app/js'));
app.use('/css', express.static(__dirname + '/node_modules/remodal/dist'));

var domain = process.env.DOMAIN || 'membermoose.local';
app.use(subdomain({
  domain: domain,
  namespace: 'accounts',
  www: 'true'
}));

app.param('subdomain', function(req, res, next, subdomain) {
    // save name to the request
    console.log("found subdomain: " + subdomain);
    req.subdomain = subdomain;

    next();
});

app.use('/accounts/:subdomain', plansRoutes);
app.use('/accounts/:subdomain/subscribe/:plan_id', function(req, res) {
  res.render('public/subscribe');
});

app.use('/', routes);
app.use('/partials/dashboard/:name', function(req, res) {
  var name = req.params.name;
  res.render('partials/dashboard/' + name);
});
app.use('/partials/users/:name', function(req, res) {
  console.log('getting user partial');
  var name = req.params.name;
  res.render('partials/users/' + name);
});
app.use('/users', users);
app.use('/dashboard', dashboard);

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
