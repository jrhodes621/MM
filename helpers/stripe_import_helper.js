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
          var plan = {
            reference_id: stripePlan.id,
            plan_name: stripePlan.name
          }

          plans.push(plan);
        });

        callback(err, plans);
      }
    );
  },
  importMembersForPlan: function(bull, plan, callback) {
    var stripe_api_key = bull.account.stripe_connect.access_token;

    Step(
      function getSubscriptionsFromStripe() {
        console.log("***Getting Subscriptions from Stripe");

        StripeManager.listSubscriptions(stripe_api_key, plan.reference_id, null, [], this);
      },
      function parseSubscriptions(err, stripe_subscriptions) {
        if(err) { console.log(err); }

        console.log("***Parsing StripeSubscriptions");
        console.log("found " + stripe_subscriptions);
        SubscriptionHelper.parse(bull, stripe_api_key, stripe_subscriptions, plan, this);
      },
      function addMembersToPlan(err, members) {
        if(err) { throw err; }

        module.exports.addMembersToPlan(plan, members, this);
      },
      function importCharges(err, members) {
        if(err) { console.log(err); }

        console.log("***Import Charges");
        console.log("found " + members.length);

        module.exports.importChargesForUsers(stripe_api_key, members, this);
      },
      function doCallback(err, members) {
        if(err) { console.log(err); }

        console.log("***Do importMembersFromStripe callback");
        console.log("found " + members.length);

        callback(err, plan, members);
      }
    );
  },
  addMembersToPlan:function(plan, members, callback) {
    var numberOfMembers = members.length;

    if(numberOfMembers == 0) {
      callback(null, members);
    }
    members.forEach(function(member) {
      Step(
        function addMemberToPlan() {
          plan.members.push(member);

          return member
        },
        function doCallback(err, member) {
          if(err) {console.log(err); }

          numberOfMembers -= 1;
          if(numberOfMembers == 0) {
            callback(err, members);
          }
        }
      )
    });
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
