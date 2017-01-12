require('dotenv').config({ silent: true });

var debug = require('debug')('ishopaway:server');
var express = require("express");
var app = express();
var router = express.Router();
var logger = require('morgan');
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });
var cookieParser = require('cookie-parser');
var path = require("path");
var bodyParser = require("body-parser");
var errorHandler = require('api-error-handler');
var mongoose = require("mongoose");
var jwt    = require('jsonwebtoken');
var cors = require('cors');
var params = require('./params');

var dashboard = require('./routes/dashboard');
var routes = require('./routes/index');
var plansRoutes = require('./routes/plans');
var users = require('./routes/users');
var partials = require('./routes/partials');
var subdomain = require('wildcard-subdomains');
var Plan = require('./models/plan');
var PaymentCard = require('./models/payment_card');
var User = require('./models/user');

var app = express();

var AccountsController = require('./controllers/accounts.controller');
var ActivitiesController = require('./controllers/activities.controller');
var MembersController = require('./controllers/members.controller');
var MessagesController = require('./controllers/messages.controller');
var MeController = require('./controllers/me.controller');
var OAuthController = require('./controllers/oauth.controller');
var FunnelController = require('./controllers/funnel.controller');
var PlansController = require('./controllers/plans.controller');
var PlanActivitiesController = require('./controllers/plan_activities.controller');
var PlanMembersController = require('./controllers/plan_members.controller');
var SessionsController = require('./controllers/sessions.controller');
var StripeEventsController = require('./controllers/stripe_events.controller');
var SubscribeController = require('./controllers/subscribe.controller');
var SubscriptionsController = require('./controllers/subscriptions.controller');
var UsersController = require('./controllers/users.controller');
var UserActivitiesController = require('./controllers/user_activities.controller');
var UserChargesController = require('./controllers/user_charges.controller');
var UserDevicesController = require('./controllers/user_devices.controller');
var UserMessagesController = require('./controllers/user_messages.controller');
var UserPaymentCardsController = require('./controllers/user_payment_cards.controller');
var UserMessagesController = require('./controllers/user_messages.controller');

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
var server = app.listen(process.env.PORT || 8080  , function () {
  var port = server.address().port;
  console.log(port);
  console.log("Server now running on port", port);
});

// Generic error handler used by all endpoints.
function logErrors (err, req, res, next) {
  console.log("logging error");

  console.error(err.stack)
  next(err)
}
function clientErrorHandler (err, req, res, next) {
  console.log("client error handler");

  if (req.xhr) {
    res.status(500).send({ error: err })
  } else {
    next(err)
  }
}
function errorHandler (err, req, res, next) {
  console.log("error handler");

  res.status(500)
  res.render('error', { error: err })
}
function errorNotification(err, str, req) {
  console.log("error notification: " + err)
  // airbrake.notify(err, function(err, url) {
  //   if (err) throw err;
  // });
}

function GetToken(req, res, next) {
  console.log("looking for token");
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, process.env.SECRET, { header: 'JWT' }, function(err, decoded) {
      if (err) {
        if(err.name == 'TokenExpiredError') {
          return res.status(401).send({ success: false, message: 'Token expired.' });
        } else {
          return res.status(403).send({ success: false, message: 'Failed to authenticate token.' });
        }
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        var user_id = decoded._id;

        User.findById(user_id)
        .populate('account')
        .populate('plans')
        .exec(function(err, user) {
          if (err) {
            return res.status(403).send({ success: false, message: 'Failed to authenticate token.' });
          } else {
            req.current_user = user;

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
}
//app.use(handleError);

//Public endpoints
router.post('/accounts/:subdomain/api/subscribe', SubscribeController.CreateSubscription);
router.post('/funnel/step1', FunnelController.Step1);
router.post('/sessions', SessionsController.CreateSession);
router.post('/sessions/verify', SessionsController.RefreshSession);
router.post('/stripe_events', StripeEventsController.CreateStripeEvent);
router.post('/users', UsersController.CreateUser);
router.get('/users/auth/stripe_connect/callback', OAuthController.StripeConnectCallback);

router.use(GetToken);

//Private Endpoints
//Accounts
router.put('/accounts', AccountsController.UpdateAccount);

//Activities
router.get('/activities', ActivitiesController.GetActivities);

//Funnel
router.post('/funnel/step2', FunnelController.Step2);
router.post('/funnel/step3', FunnelController.Step3);

//Me
router.get('/me', MeController.GetUser);

//Members
router.get('/members', MembersController.GetMembers);
router.get('/members/:user_id', MembersController.GetMember);
router.post('/members', MembersController.CreateMember);

//Messages
router.get('/messages', MessagesController.GetMessages);
router.get('/messages/:user_id', UserMessagesController.GetMessages);
router.post('/messages/:user_id', UserMessagesController.CreateMessage);

//Plans
router.get('/plans', PlansController.GetPlans);
router.get('/plans/:plan_id', PlansController.GetPlan);
router.post('/plans', PlansController.CreatePlan);
router.put('/plans/:plan_id', PlansController.UpdatePlan);
router.delete('/plans/:plan_id', PlansController.DeletePlan);
router.get('/plans/:plan_id/members', PlanMembersController.GetMembers);
router.get('/plans/:plan_id/activities', PlanActivitiesController.GetActivities);

//Subscriptions
router.post('/users/:user_id/subscriptions', SubscriptionsController.CreateSubscription);
router.delete('/users/:user_id/subscriptions/:subscription_id', SubscriptionsController.DeleteSubscription);
router.post('/users/:user_id/subscriptions/:subscription_id/upgrade', SubscriptionsController.UpgradeSubscription);

//Users
router.put('/users/:user_id', UsersController.UpdateUser);
router.get('/users/:user_id/activities', UserActivitiesController.GetActivities)
router.get('/users/:user_id/charges', UserChargesController.GetCharges);
router.post('/users/:user_id/charges', UserChargesController.CreateCharge);
router.post('/users/:user_id/devices', UserDevicesController.CreateDevice);
router.get('/users/:user_id/messages', UserMessagesController.GetMessages);
router.post('/users/:user_id/payment_cards', UserPaymentCardsController.CreatePaymentCard)

router.param('plan_id', params.GetPlan);
router.param('user_id', params.GetUser);

router.use(errorHandler());
// apply the routes to our application with the prefix /api
app.use('/api', router);

module.exports = app;
