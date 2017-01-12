var async              = require("async");
var StripeServices     = require('../../services/stripe.services');
var Membership         = require('../../models/membership');
var Plan               = require('../../models/plan');
var Subscription       = require('../../models/subscription');
var User               = require('../../models/user');
var PlanParser         = require('../../parsers/stripe/plan_parser');

function parse(bull, stripe_subscription, callback) {
  var result = null;
  //var stripe_api_key = bull.stripe_connect.access_token;

  async.waterfall([
    function getStripeCustomer(callback) {
      var stripe_customer = {
        "id": "cus_7Vaek4PEyYBvsJ",
        "object": "customer",
        "account_balance": 0,
        "created": 1483908144,
        "currency": "usd",
        "default_source": null,
        "delinquent": false,
        "description": null,
        "discount": null,
        "email": "james+200@somehero.com",
        "livemode": false,
        "metadata": {
        },
        "shipping": null,
        "sources": {
          "object": "list",
          "data": [

          ],
          "has_more": false,
          "total_count": 0,
          "url": "/v1/customers/cus_9tagyvZXCzFCj9/sources"
        },
        "subscriptions": {
          "object": "list",
          "data": [

          ],
          "has_more": false,
          "total_count": 0,
          "url": "/v1/customers/cus_9tagyvZXCzFCj9/subscriptions"
        }
      }
      // StripeServices.getCustomer(stripe_api_key, stripe_subscription.customer, function(err, customer) {
      //   if(!customer) { return callback(new Error("Can't get customer from Stripe"), null); }
      //
      //   callback(err, stripe_customer);
      // });
      callback(null, stripe_customer);
    },
    function getUser(stripe_customer, callback) {
      User.findOne({"email_address": stripe_customer.email}, function(err, user) {
        callback(err, user, stripe_customer);
      });
    },
    function parseUser(user, stripe_customer, callback) {
      if(!user) {
        user = new User();

        user.password = "Test123";
      }

      user.email_address = stripe_customer.email;
      user.roles.push("Calf");
      user.status = "active";

      user.save(function(err) {
        callback(err, user)
      });
    },
    function getMembership(user, callback) {
      Membership.findOne({"reference_id": stripe_subscription.customer}, function(err, membership) {
        callback(err, membership, user);
      });
    },
    function parseMembership(membership, user, callback) {
      if(!membership) {
        membership = new Membership();
      }
      membership.reference_id = stripe_subscription.customer;
      membership.user = user;
      membership.account = bull;
      membership.member_since = new Date(); //ToDo: consider real implementation

      membership.save(function(err) {
        callback(err, membership);
      });
    },
    function parsePlan(membership, callback) {
      PlanParser.parse(bull, stripe_subscription.plan, function(err, plan) {
        callback(err, plan, membership);
      })
    },
    function getSubscription(plan, membership, callback) {
      Subscription.findOne({"reference_id": stripe_subscription.id}, function(err, subscription) {
        callback(err, subscription, plan, membership);
      });
    },
    function parseSubscription(subscription, plan, membership, callback) {
      if(!subscription) {
        subscription = new Subscription();
      }
      subscription.plan = plan;
      subscription.membership = membership;
      subscription.reference_id = stripe_subscription.id;
      subscription.subscription_created_at = stripe_subscription.created;
      subscription.subscription_canceled_at = stripe_subscription.canceled_at;
      subscription.trial_start = stripe_subscription.trial_start;
      subscription.trial_end = stripe_subscription.trial_end;
      subscription.status = stripe_subscription.status;

      subscription.save(function(err) {
        result = subscription;

        callback(err);
      });
    }
  ], function(err) {
    callback(err, result);
  });
}

module.exports = {
  parse
}
