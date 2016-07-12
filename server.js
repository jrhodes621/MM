require('dotenv').config({ silent: true });

var debug = require('debug')('ishopaway:server');

var express = require("express");
var app = express();
var router = express.Router();

var path = require("path");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var jwt    = require('jsonwebtoken');
var cors = require('cors');

var User = require('./models/user');

var WWWPORT = process.env.WWWPORT || 3000;

// use it before all route definitions
app.use(cors({origin: 'http://localhost:' + WWWPORT}));
app.use(bodyParser.json());

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;
mongoose.connect(process.env.MONGODB_URI); // connect to our database

//Initialize the app.
var server = app.listen(process.env.APIPORT || 8080, function () {
  var port = server.address().port;
  console.log(port);
  console.log("Server now running on port", port);
});

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason + ": " + code);
  res.status(code || 500).send({"error": message});
}
app.use(handleError);

var PublicFunnelRoutes = require('./api/public/funnel');
var PublicUserRoutes = require('./api/public/users');
var PublicFunnelRoutes = require('./api/public/funnel');
var SessionsRoutes = require('./api/public/sessions');
var OauthCallbackRoutes = require('./api/public/oauth');

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

router.use('/funnel', PrivateFunnelRoutes);
router.use('/members', MembersRoutes);
router.use('/plans', PlansRoutes);

// apply the routes to our application with the prefix /api
app.use('/api', router);

module.exports = app;
