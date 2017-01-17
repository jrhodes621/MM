var Plan = require('../models/plan');
var StripeServices = require('../services/stripe.services');
var Step = require('step');
var async = require("async");


module.exports = {
  parse: function(user, reference_id, callback) {
    async.waterfall([
      function getPlan(callback) {
        Plan.findOne({ "reference_id": reference_id, "user": user })
        .exec(function(err, plan) {
          callback(err, plan);
        });
      },
      function parsePlan(plan, callback) {
        if(!plan) {
          module.exports.createPlan(user, reference_id, function(err, plan) {
            callback(err, plan);
          });
        } else {
          callback(null, plan);
        }
      }
    ], function(err, plan) {
      callback(err, plan)
    });
  },
  createPlan: function(user, reference_id, callback) {
    var stripe_api_key = user.account.stripe_connect.access_token;

    async.waterfall([
      function getPlan(callback) {
        StripeServices.getPlan(stripe_api_key, reference_id, callback);
      },
      function convertRecurringInterval(stripe_plan, callback) {
        transformRecurringInterval(stripe_plan, function(err, recurring_interval) {
          callback(err, stripe_plan, recurring_interval);
        });
      },
      function parsePlan(stripe_plan, recurring_interval, callback) {
        var plan = new Plan();

        plan.user = user._id;
        plan.name = stripe_plan.name;
        plan.reference_id = stripe_plan.id;
        plan.amount = stripe_plan.amount/100;
        plan.created = stripe_plan.created;
        plan.currency = stripe_plan.currency;
        plan.interval = recurring_interval;
        plan.interval_count = stripe_plan.interval_count;
        plan.statement_descriptor = stripe_plan.statement_descriptor;
        plan.trial_period_days = stripe_plan.trial_period_days || 0;

        plan.save(function(err) {
          callback(err, plan);
        });
      }
    ], function(err, plan) {
      callback(err, plan);
    });
  }
}
