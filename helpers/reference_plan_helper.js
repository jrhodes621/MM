var Plan = require('../models/plan');
var StripeManager = require('./stripe_manager');
var Step = require('step');

function transformRecurringInterval(stripe_plan, callback) {
  switch(stripe_plan.interval) {
    case "day":
      callback(null, stripe_plan, 0);
      break;
    case "week":
      callback(null, stripe_plan, 1);
      break;
    case "month":
      callback(null, stripe_plan, 2);
      break;
    case "year":
      callback(null, stripe_plan, 3);
      break;
    default:
      callback("Invalid Recurring Interval " + stripe_plan.interval, stripe_plan, null);
  }
}
module.exports = {
  parse: function(user, reference_id, callback) {
    Step(
      function getPlan() {
        console.log("***Getting Plan***");

        Plan.findOne({ "reference_id": reference_id, "user": user })
        .exec(this);
      },
      function parsePlan(err, plan) {
        if(err) { console.log(err); }

        console.log("***Parse Referencce Plan***");

        if(!plan) {
          module.exports.createPlan(user, reference_id, this);
        } else {
          return plan
        }
      },
      function doCallback(err, plan) {
        if(err) { console.log(err); }

        console.log("***Do Callback for Reference Plan***");

        callback(err, plan)
      }
    )
  },
  createPlan: function(user, reference_id, callback) {
    var stripe_api_key = user.account.stripe_connect.access_token;

    Step(
      function getPlan() {
        console.log("***Getting Plan from Stripe***");

        StripeManager.getPlan(stripe_api_key, reference_id, this);
      },
      function convertRecurringInterval(err, stripe_plan) {
        transformRecurringInterval(stripe_plan, this);
      },
      function parsePlan(err, stripe_plan, recurring_interval) {
        if(err) { throw err; }

        console.log("***Parse Stripe Plan***");

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

        return plan;
      },
      function savePlan(err, plan) {
        if(err) { throw err; }

        plan.save(function(err) {
          if(err) { throw err; }

          user.plans.push(plan);

          console.log("***Saved Plan***");

          user.save(function(err) {
            if(err) { throw err; }

            console.log("***Saved User***");

            plan.user = user;
            callback(err, plan);
          });
        });
      }
    )
  }
}
