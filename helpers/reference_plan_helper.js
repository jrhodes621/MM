var Plan = require('../models/plan');
var StripeManager = require('./stripe_manager');
var Step = require('step');

module.exports = {
  parse: function(user, reference_id, callback) {
    Step(
      function getPlan() {
        console.log("***Getting Plan***");
        console.log(reference_id);

        Plan.findOne({ "reference_id": reference_id, "user": user })
        .populate('user')
        .populate({
          path: 'user',
          populate: [{
            path: 'account'
          }]
        })
        .exec(this);
      },
      function parsePlan(err, plan) {
        if(err) { console.log(err); }

        console.log("***Parse Referencce Plan***");
        console.log(plan);

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
      function parsePlan(err, stripe_plan) {
        if(err) { console.log(err); }

        console.log("***Parse Stripe Plan***");

        var plan = new Plan();

        plan.user = user._id;
        plan.name = stripe_plan.name;
        plan.reference_id = stripe_plan.id;
        plan.amount = stripe_plan.amount;
        plan.created = stripe_plan.created;
        plan.currency = stripe_plan.currency;
        plan.interval = stripe_plan.interval;
        plan.interval_count = stripe_plan.interval_count;
        plan.statement_descriptor = stripe_plan.statement_descriptor;
        plan.trial_period_days = 0 //stripePlan.trial_period_days;

        return plan;
      },
      function savePlan(err, plan) {
        if(err) { console.log(err); }

        console.log("***Save Plan***");
        console.log(plan);

        plan.save(function(err) {
          if(err) { console.log(err); }

          user.plans.push(plan);

          console.log("***Saved Plan***");

          user.save(function(err) {
            if(err) { console.log(err); }

            console.log("***Saved User***");

            plan.user = user;
            callback(err, plan);
          });
        });
      }
    )
  }
}
