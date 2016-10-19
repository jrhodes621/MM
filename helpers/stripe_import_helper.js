var request = require('request');
var Plan = require('../models/plan');
var Subscription = require('../models/subscription');
var StripeManager = require('./stripe_manager');
var User = require('../models/user');

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

    StripeManager.listSubscriptions(stripe_api_key, plan.reference_id, function(err, subscriptions) {
      var errors = [];
      var members = [];

      var subscriptionsCount = subscriptions.data.length;

      if(subscriptionsCount == 0) {
        callback(errors, members);
      }
      subscriptions.data.forEach(function(stripe_subscription) {
        StripeManager.getMember(stripe_api_key, stripe_subscription.customer, function(err, customer) {
          subscriptionsCount = subscriptionsCount - 1;

          if(err) {
            console.log(err);
          } else {
            var subscription = new Subscription();
            subscription.plan = plan;
            subscription.reference_id = stripe_subscription.id;
            subscription.subscription_created_at = stripe_subscription.created_at;
            subscription.subscription_canceled_at = stripe_subscription.canceled_at;
            subscription.trial_start = stripe_subscription.trial_start;
            subscription.trial_end = stripe_subscription.trial_end;
            subscription.status = stripe_subscription.status;

            var memberUser = new User();
            memberUser.email_address = customer.email;
            memberUser.memberships.push({
              reference_id: customer.id,
              company_name: user.company_name,
              plan_name: plan.name,
              member_since: customer.created,
              subscription: subscription
            })
            members.push(memberUser);

            if(subscriptionsCount == 0) {
              callback(errors, members);
            }
          }
        });
      });
    });
  }
}
