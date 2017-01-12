var request = require('request');
var Charge = require('../models/charge');
var Membership = require('../models/membership');
var PaymentCard = require('../models/payment_card');
var Plan = require('../models/plan');
var Subscription = require('../models/subscription');
var StripeServices = require('../services/stripe.services');
var ChargeHelper = require('./charge_helper');
var SubscriptionHelper = require('./subscription_helper')
var User = require('../models/user');
var async = require("async");

function importPlans(bull, callback) {
  var stripe_api_key = bull.stripe_connect.access_token;

  async.waterfall([
    function getStripePlans(callback) {
      StripeServices.listPlans(stripe_api_key, function(err, stripePlans) {
        callback(err, stripePlans.data);
      });
    },
    function parsePlans(stripePlans) {
      var plans = [];
      async.eachSeries(stripePlans, function(stripe_plan, callback) {
        PlanParser.parse(bull, stripe_plan, callback);
      }, function() {
        callback(null, plans);
      });
    }
  ], function(plans) {
    callback(null, plans)
  });
}
function importSubscriptions(bull, plan, callback) {
  var stripe_api_key = bull.account.stripe_connect.access_token;

  async.waterfall([
    function getSubscriptionsFromStripe(callback) {
      StripeServices.listSubscriptions(stripe_api_key, plan.reference_id, null, [], callback);
    },
    function parseSubscriptions(stripe_subscriptions, callback) {
      async.seriesEach(stripe_subscriptions, function(stripe_subscription) {
        CustomerSubscriptionParser.parse(bull, stripe_subscription, function(err, users) {
          callback(err, users);
        });
      })
    }
  ], function(err, users) {
    callback(err, users);
  });
}
function importCharges(bull, users, callback) {
  var stripe_api_key = bull.account.stripe_connect.access_token;
  var all_charges = [];

  async.eachSeries(users, function(user, callback) {
    async.waterfall([
      function getMembership(callback) {
        getMembershipById(user.memberships[0], callback);
      },
      function getStripeCharges(membership, callback) {
        StripeServices.listCharges(stripe_api_key, membership.reference_id, function(err, stripe_charges) {
          callback(err, stripe_charges, membership);
        });
      },
      function parseCharges(stripe_charges, membership, callback) {
        var all_charges = [];

        async.eachSeries(stripe_charges, function(stripe_charge, callback) {
          ChargeParser.parse(membership, stripe_charge, "Active", function(err, charge) {
            all_charges.push(charge);

            callback(err)
          })
        }, function(err) {
          callback(err, all_charges)
        })
      }
    ], function(err, results) {
      all_charges.push(results);

      callback(err, results);
    });
  }, function(err) {
    callback(err, all_charges);
  });
}
function importCoupons() {

}
function importDiscounts() {

}
function importInvoices() {

}

module.exports = {
  importPlans,
  importSubscriptions,
  importCharges
}
