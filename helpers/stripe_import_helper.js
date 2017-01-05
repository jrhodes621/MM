var request = require('request');
var Charge = require('../models/charge');
var Membership = require('../models/membership');
var PaymentCard = require('../models/payment_card');
var Plan = require('../models/plan');
var Subscription = require('../models/subscription');
var StripeManager = require('./stripe_manager');
var ChargeHelper = require('./charge_helper');
var SubscriptionHelper = require('./subscription_helper')
var User = require('../models/user');
var async = require("async");

function getMembershipById(membership_id, callback) {
  Membership.findById(membership_id, function(err, membership) {
    callback(err, membership);
  });
}
module.exports = {
  importFromStripe: function(user, callback) {
    var stripe_api_key = user.account.stripe_connect.access_token;

    async.waterfall([
      function getStripePlans(callback) {
        StripeManager.listPlans(stripe_api_key, function(err, stripePlans) {
          callback(err, stripePlans.data);
        });
      },
      function parsePlans(stripePlans) {
        var plans = [];
        async.eachSeries(stripePlans, function(stripePlan, callback) {
          var plan = {
            reference_id: stripePlan.id,
            plan_name: stripePlan.name
          }
          plans.push(plan);

          callback(null, plan);
        }, function() {
          callback(null, plans);
        });
      }
    ], function(plans) {
      callback(null, plans)
    });
  },
  importMembersForPlan: function(bull, plan, callback) {
    var stripe_api_key = bull.account.stripe_connect.access_token;

    async.waterfall([
      function getSubscriptionsFromStripe(callback) {
        StripeManager.listSubscriptions(stripe_api_key, plan.reference_id, null, [], callback);
      },
      function parseSubscriptions(stripe_subscriptions, callback) {
        SubscriptionHelper.parse(bull, stripe_api_key, stripe_subscriptions, plan, function(err, users) {
          callback(err, users);
        });
      }
    ], function(err, users) {
      callback(err, users);
    });
  },
  importChargesForMembers: function(bull, users, callback) {
    var stripe_api_key = bull.account.stripe_connect.access_token;
    var all_charges = [];

    async.eachSeries(users, function(user, callback) {
      async.waterfall([
        function getMembership(callback) {
          getMembershipById(user.memberships[0], callback);
        },
        function importCharges(membership, callback) {
          module.exports.importChargesForUser(stripe_api_key, user, membership, callback);
        }
      ], function(err, results) {
        all_charges.push(results)
        callback(err, results);
      });
    }, function(err) {
      callback(err, all_charges);
    });
  },
  importChargesForUser: function(stripe_api_key, user, membership, callback) {
    async.waterfall([
      function getChargesFromStripe(callback) {
        StripeManager.listCharges(stripe_api_key, membership.reference_id, callback);
      },
      function parseCharges(stripe_charges) {
        ChargeHelper.parse(user, stripe_charges, membership, callback);
      }
    ], function(err, results) {
      callback(err, results);
    });
  }
}
