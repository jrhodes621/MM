var request = require('request');
var Charge = require('../models/charge')
var PaymentCard = require('../models/payment_card');
var Plan = require('../models/plan');
var Subscription = require('../models/subscription');
var StripeManager = require('./stripe_manager');
var ChargeHelper = require('./charge_helper');
var SubscriptionHelper = require('./subscription_helper')
var User = require('../models/user');
var Step = require('step');

module.exports = {
  importFromStripe: function(user, callback) {
    var stripe_api_key = user.account.stripe_connect.access_token;

    Step(
      function getStripePlans() {
        StripeManager.listPlans(stripe_api_key, this)
      },
      function parsePlans(err, stripePlans) {
        var plans = [];
        stripePlans.data.forEach(function(stripePlan) {
          var plan = new Plan();
          plan.user = user._id;
          plan.name = stripePlan.name;
          plan.reference_id = stripePlan.id;
          plan.amount = stripePlan.amount;
          plan.created = stripePlan.created;
          plan.currency = stripePlan.currency;
          plan.interval = stripePlan.interval;
          plan.interval_count = stripePlan.interval_count;
          plan.statement_descriptor = stripePlan.statement_descriptor;
          plan.trial_period_days = 0 //stripePlan.trial_period_days;

          plans.push(plan);
        });

        callback(err, plans);
      }
    );
  },
  importMembersFromPlan: function(user, plan, callback) {
    var stripe_api_key = user.account.stripe_connect.access_token;

    Step(
      function getSubscriptionsFromStripe() {
        console.log("***Getting Subscriptions from Stripe");

        StripeManager.listSubscriptions(stripe_api_key, plan.reference_id, this);
      },
      function parseSubscriptions(err, stripe_subscriptions) {
        if(err) { console.log(err); }

        console.log("***Parsing StripeSubscriptions");
        console.log("found " + stripe_subscriptions.data);
        console.log("here");
        SubscriptionHelper.parse(stripe_api_key, stripe_subscriptions.data, plan, this);
      },
      function importCharges(err, memberUsers) {
        if(err) { console.log(err); }

        console.log("***Import Charges");
        console.log("found " + memberUsers.length);

        module.exports.importChargesForUsers(stripe_api_key, memberUsers, this);
      },
      function returnMembers(err, memberUsers) {
        if(err) { console.log(err); }

        console.log("***Do importMembersFromStripe callback");
        console.log("found " + memberUsers.length);

        callback(err, memberUsers);
      }
    );
  },
  importChargesForUsers:function(stripe_api_key, users, callback) {
    var numberOfUsers = users.length;

    if(numberOfUsers == 0) {
      callback(null, users);
    }
    users.forEach(function(user) {
      Step(
        function importCharges() {
          module.exports.importChargesForUser(stripe_api_key, user, this)
        },
        function doCallback(err, user) {
          if(err) {console.log(err); }

          numberOfUsers -= 1;
          if(numberOfUsers == 0) {
            callback(err, users);
          }
        }
      )
    });
  },
  importChargesForUser: function(stripe_api_key, user, callback) {
    Step(
      function getChargesFromStripe() {
        StripeManager.listCharges(stripe_api_key, user.memberships[0].reference_id, this);
      },
      function parseCharges(err, charges) {
        if(err) { console.log(err); }

        ChargeHelper.parse(charges, this)
      },
      function saveCharges(err, charges) {
        if(err) { console.log(err); }

        ChargeHelper.saveCharges(user, charges, this)
      },
      function returnCharges(err, user) {
        if(err) { console.log(err); }

        callback(err, user);
      }
    )
  }
}
