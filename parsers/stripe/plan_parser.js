var Plan      = require('../../models/plan');
var async     = require("async");

function parse(bull, stripe_plan, callback) {
  var result = null;

  async.waterfall([
    function getPlan(callback) {
      Plan.findOne({ "reference_id": stripe_plan.id }, callback);
    },
    function parsePlan(plan, callback) {
      if(!plan) {
        plan = new Plan();
      }
      plan.account = bull;
      plan.amount = stripe_plan.amount/100;
      plan.reference_id = stripe_plan.id;
      //plan.currency = stripe_plan.currency;
      plan.interval = 0; //"month";
      plan.interval_count = stripe_plan.interval_count;
      plan.name = stripe_plan.name;
      plan.statement_descriptor = stripe_plan.statement_descriptor;
      plan.trial_period_days = stripe_plan.trial_period_days || 0;

      plan.save(function(err) {
        result = plan;

        if(bull.plans.indexOf(plan._id) === -1) {
          bull.plans.push(plan);

          bull.save(function(err) {
            callback(err)
          })
        } else {
          callback(err);
        }
      });
    }
  ], function(err) {
    callback(err, result);
  });
}
function transformRecurringInterval(stripe_plan, callback) {
  switch(stripe_plan.interval) {
    case "day":
      callback(null, 0);
      break;
    case "week":
      callback(null, 1);
      break;
    case "month":
      callback(null, 2);
      break;
    case "year":
      callback(null, 3);
      break;
    default:
      callback("Invalid Recurring Interval " + stripe_plan.interval, null);
  }
}

module.exports = {
  parse,
  transformRecurringInterval
}
