var express = require('express');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var path = require('path');
var compression = require('compression');
var session = require('cookie-session');

var Upload = require('s3-uploader');
var multer  = require('multer');

var upload = multer({ storage: storage  });
// Shared modules and middleware
var errors = require('./errors');
var logs = require('./logs');
var params = require('../../params');
var security = require('../../security');

var router = express.Router();

// Routers
//var users = require('./users/router');
//var articles = require('./articles/router');
//var benchmark = require('./benchmark/router');
var AccountsController = require('../../controllers/accounts.controller');
var ActivitiesController = require('../../controllers/activities.controller');
var MembersController = require('../../controllers/members.controller');
var MessagesController = require('../../controllers/messages.controller');
var MeController = require('../../controllers/me.controller');
var OAuthController = require('../../controllers/oauth.controller');
var OnboardingController = require('../../controllers/onboarding.controller');
var FunnelController = require('../../controllers/funnel.controller');
var PlansController = require('../../controllers/plans.controller');
var PlanActivitiesController = require('../../controllers/plan_activities.controller');
var PlanMembersController = require('../../controllers/plan_members.controller');
var SessionsController = require('../../controllers/sessions.controller');
var StripeEventsController = require('../../controllers/stripe_events.controller');
var SubscribeController = require('../../controllers/subscribe.controller');
var SubscriptionsController = require('../../controllers/subscriptions.controller');
var UsersController = require('../../controllers/users.controller');
var UserActivitiesController = require('../../controllers/user_activities.controller');
var UserChargesController = require('../../controllers/user_charges.controller');
var UserDevicesController = require('../../controllers/user_devices.controller');
var UserMessagesController = require('../../controllers/user_messages.controller');
var UserPaymentCardsController = require('../../controllers/user_payment_cards.controller');
var UserMessagesController = require('../../controllers/user_messages.controller');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null,  file.originalname );
  }
});
// Constants
var ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

function GetToken(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if(!token) {
    return res.status(403).send({
        success: false,
        message: 'No token provided.'
    });
  }

  security.validate_token(token, process.env.SECRET, function(err, status_code, minor_code, user) {
    if(err) {
      return res.status(status_code).send({
        success: false,
        minor_code: minor_code,
        message: err
      });
    }

    req.currentUser = user;

    return next();
  });
}

module.exports = function Web(app, config) {
  var web = express();
  var errs = errors(config.verbose);

  //var icon = path.join(__dirname, 'public', 'node-favicon.png');
  // Express configuration
  web
    .set('view engine', 'jade')
    .set('view cache', config.view_cache);

  // Shared middleware
  web
    .use(compression())
    //.use(favicon(icon))
    .use(logs(config.verbose))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: false }))
    .use(session({ secret: config.cookie_secret, maxAge: ONE_WEEK }));

  // Routers
  // web
  //   .use(users(app))
  //   .use(articles(app))
  //   .use(benchmark(app, config.benchmark, config.benchmark_add, config.benchmark_vote));

  // Shared error handling

  //Public endpoints
  router.post('/accounts/:subdomain/subscribe', SubscribeController.CreateSubscription);
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
  router.post('/users/:user_id/payment_cards', UserPaymentCardsController.CreatePaymentCard);
  router.post('/users/:user_id/connect_stripe', OnboardingController.ConnectStripe);

  router.param('plan_id', params.GetPlan);
  router.param('user_id', params.GetUser);

  //router.use(errorHandler());
  // apply the routes to our application with the prefix /api
  web
    .use('/api', router);

  web
    .use(errs.notFound)
    .use(errs.log)
    .use(errs.json)
    .use(errs.html);

  return web;
};
