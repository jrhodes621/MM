var request = require('request');
var Member = require('../models/member');
var Plan = require('../models/plan');
var Subscription = require('../models/subscription');
var StripeManager = require('./stripe_manager')

module.exports = {
  importFromStripe: function(user, callback) {
    stripe_api_key = user.stripe_connect.access_token;

    StripeManager.listPlans(stripe_api_key, function(err, stripePlans) {
      var errors = [];
      var plans = [];

      if(err) {
        errors.push(err);

        callback(errors, null);
      }

      stripePlans.data.forEach(function(stripePlan) {
        var plan = new Plan();
        plan.name = stripePlan.name;
        plan.reference_id = stripePlan.id;
        plan.amount = stripePlan.amount;
        plan.created = stripePlan.created;
        plan.currency = stripePlan.currency;
        plan.interval = stripePlan.interval;
        plan.interval_count = stripePlan.interval_count;
        plan.statement_descriptor = stripePlan.statement_descriptor;
        plan.trial_period_days = 0 //stripePlan.trial_period_days;

        plans.push(plan)
      });

      callback(errors, plans);
    })
  },
  importMembersFromPlan: function(user, plan, callback) {
    stripe_api_key = user.stripe_connect.access_token;

    StripeManager.listSubscriptions(stripe_api_key, plan.refernce_id, function(err, subscriptions) {
      var errors = [];
      var members = [];

      var subscriptionsCount = subscriptions.data.length;

      if(subscriptionsCount == 0) {
        callback(errors, members);
      }
      subscriptions.data.forEach(function(subscription) {
        StripeManager.getMember(stripe_api_key, subscription.customer, function(err, customer) {
          subscriptionsCount = subscriptionsCount - 1;

          if(err) {
            console.log(err);
          } else {
            var member = new Member();
            member.email_address = customer.email;
            member.reference_id = customer.id;
            member.member_since = customer.created;

            members.push(member);
            if(subscriptionsCount == 0) {
              callback(errors, members);
            }
          }
        });
      });
    });
  }
}
