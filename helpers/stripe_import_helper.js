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
var Step = require('step');

function getMembershipById(membership_id, callback) {
  Membership.findById(membership_id, function(err, membership) {
    callback(err, membership);
  });
}
module.exports = {
  importFromStripe: function(user, callback) {
    var stripe_api_key = user.account.stripe_connect.access_token;

    Step(
      function getStripePlans() {
        StripeManager.listPlans(stripe_api_key, this)
      },
      function parsePlans(err, stripePlans) {
        if(err) { throw err; }

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
        if(err) { throw err; }

        console.log("***Parsing StripeSubscriptions");

        SubscriptionHelper.parse(bull, stripe_api_key, stripe_subscriptions, plan, this);
      },
      function addMembersToPlan(err, members) {
        if(err) { throw err; }

        module.exports.addMembersToPlan(plan, members, this);
      },
      function doCallback(err, members) {
        if(err) { throw err; }

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
          if(err) { throw err; }

          numberOfMembers -= 1;
          if(numberOfMembers == 0) {
            callback(err, members);
          }
        }
      )
    });
  },
  importChargesForMembers:function(bull, plan, users, callback) {
    console.log("importing charges");

    var stripe_api_key = bull.account.stripe_connect.access_token;
    var numberOfUsers = users.length;

    if(numberOfUsers == 0) {
      callback(null, plan, users);
    }
    users.forEach(function(user) {
      Step(
        function getMembership() {
          getMembershipById(user.memberships[0], this);
        },
        function importCharges(err, membership) {
          if(err) { throw err; }

          module.exports.importChargesForUser(stripe_api_key, user, membership, this)
        },
        function doCallback(err, user) {
          if(err) { throw err; }

          numberOfUsers -= 1;
          if(numberOfUsers == 0) {
            callback(err, plan, users);
          }
        }
      )
    });
  },
  importChargesForUser: function(stripe_api_key, user, membership, callback) {
    Step(
      function getChargesFromStripe() {
        console.log("getting charges");

        StripeManager.listCharges(stripe_api_key, membership.reference_id, this);
      },
      function parseCharges(err, charges) {
        if(err) { throw err; }

        console.log("parsing charges");

        ChargeHelper.parse(charges, membership, this)
      },
      function saveCharges(err, charges) {
        if(err) { throw err; }
        console.log("saving charges");

        ChargeHelper.saveCharges(user, charges, this)
      },
      function doCallback(err, user) {
        if(err) { throw err; }

        callback(err, user);
      }
    )
  }
}
