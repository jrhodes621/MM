require('dotenv').config({ silent: true });

var debug = require('debug')('ishopaway:server');
var express = require("express");
var app = express();
var router = express.Router();
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var path = require("path");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var jwt    = require('jsonwebtoken');
var cors = require('cors');

var dashboard = require('./routes/dashboard');
var routes = require('./routes/index');
var plansRoutes = require('./routes/plans');
var users = require('./routes/users');
var partials = require('./routes/partials');
var subdomain = require('wildcard-subdomains');
var User = require('./models/user');

var app = express();

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;
mongoose.connect(process.env.MONGODB_URI); // connect to our database

app.options('*', cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/partials/users')));
app.use('/js', express.static(__dirname + '/node_modules/remodal/dist'));
app.use('/js', express.static(__dirname + '/node_modules/angular'));
app.use('/js', express.static(__dirname + '/node_modules/angular-route'));
app.use('/js', express.static(__dirname + '/node_modules/ngstorage'));
app.use('/js', express.static(__dirname + '/node_modules/angular-sanitize'));
app.use('/js', express.static(__dirname + '/node_modules/angular-ui-bootstrap/dist'));
app.use('/js', express.static(__dirname + '/node_modules/angular-payments/lib'));
app.use('/js', express.static(__dirname + '/public/app/js'));
app.use('/css', express.static(__dirname + '/node_modules/remodal/dist'));

var domain = process.env.DOMAIN || 'membermoose.local';
console.log(domain);
// app.use(subdomain({
//   domain: domain,
//   namespace: 'accounts',
//   www: 'true'
// }));
//
// app.param('subdomain', function(req, res, next, subdomain) {
//     // save name to the request
//     console.log("found subdomain: " + subdomain);
//     req.subdomain = subdomain;
//
//     next();
// });

//app.use('/accounts/:subdomain', plansRoutes);
app.use('/', routes);
app.use('/partials/users/:name', function(req, res) {
  console.log("loading user partial");

  var name = req.params.name;
  res.render('partials/users/' + name);
});
app.use('/partials/dashboard/:name', function(req, res) {
  var name = req.params.name;
  res.render('partials/dashboard/' + name);
});
app.use('/partials/:name', function(req, res) {
  console.log(req);

  var name = req.params.name;
  res.render('partials/' + name);
});
app.use('/accounts/:subdomain/partials/public/:name', function(req, res) {

  var name = req.params.name;
  res.render('partials/public/' + name);
});
app.use('/users', users);
app.use('/dashboard', dashboard);

//Initialize the api.
var server = app.listen(process.env.PORT || 8080, function () {
  var port = server.address().port;
  console.log(port);
  console.log("Server now running on port", port);
});

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason + ": " + code);
  res.status(code || 500).send({"error": message});
}
//app.use(handleError);

var PublicFunnelRoutes = require('./api/public/funnel');
var PublicUserRoutes = require('./api/public/users');
var PublicFunnelRoutes = require('./api/public/funnel');
var SessionsRoutes = require('./api/public/sessions');
var OauthCallbackRoutes = require('./api/public/oauth');
var SubscribeRoutes = require('./api/public/subscribe');

router.use('/funnel/step1', PublicFunnelRoutes);
router.use('/users/auth', OauthCallbackRoutes);
router.use('/sessions', SessionsRoutes);
router.use('/users', PublicUserRoutes);

router.use(function(req, res, next) {
  console.log("looking for token");
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, process.env.SECRET, { header: 'JWT' }, function(err, decoded) {
      if (err) {
        return res.status(403).send({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        var user_id = decoded._id;

        User.findById(user_id)
        .populate('account')
        .populate('subscriptions')
        .exec(function(err, user) {
          if (err) {
            return res.status(403).send({ success: false, message: 'Failed to authenticate token.' });
          } else {
            req.user = user;

            console.log(req.user);
            next();
          }
        });
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({
        success: false,
        message: 'No token provided.'
    });

  }
});

var MembersRoutes = require('./api/private/members.js');
var PlansRoutes = require('./api/private/plans.js');
var PrivateFunnelRoutes = require('./api/private/funnel');
var PrivateUserRoutes = require('./api/private/users.js')

router.use('/funnel', PrivateFunnelRoutes);
router.use('/members', MembersRoutes);
router.use('/plans', PlansRoutes);
router.user('/users/:user_id', PrivateUserRoutes)

// apply the routes to our application with the prefix /api
app.use('/api', router);
app.use('/accounts/:subdomain/api/subscribe', SubscribeRoutes);


module.exports = app;
