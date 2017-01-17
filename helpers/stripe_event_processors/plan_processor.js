var StripePlanParser       = require('../../parsers/stripe/plan_parser');
var StripeEventHelper      = require('../../helpers/stripe_event_helper');
var Plan                   = require('../../models/plan');
const source = "Stripe";

module.exports = {
  processCreated: function(stripe_event, bull, callback) {
    var stripe_plan = stripe_event.data.object;
    var received_at = new Date(stripe_event.created*1000);

    Plan.findOne({ "reference_id": stripe_plan.id}, function(err, plan) {
      if(err) { return callback(err, null) }

      StripePlanParser.parse(bull, stripe_plan, function(err, plan) {
        if(err) { return callback(err, null) }

        var message_bull= "A new plan, " + plan.name + ", was created!";

        StripeEventHelper.notifyUsers("plan_created", bull, null, plan, message_bull, null, source, received_at, function(err, activities) {
          callback(err, plan, activities);
        });
      });
    });
  },
  processDeleted: function(stripe_event, bull, callback) {
    var stripe_plan = stripe_event.data.object;
    var received_at  = new Date(stripe_event.created*1000);

    Plan.findOne({ "reference_id": stripe_plan.id}, function(err, plan) {
      if(err) { return callback(err, null) }

      StripePlanParser.parse(bull, stripe_plan, function(err, plan) {
        if(err) { return callback(err, null) }

        plan.archive = true;
        Plan.SavePlan(plan, function(err) {
          if(err) { return callback(err, null) }

          var message_bull= "Your plan, " + plan.name + ", was deleted.";

          StripeEventHelper.notifyUsers("plan_deleted", bull, null, plan, message_bull, null, source, received_at, function(err, activities) {
            callback(err, plan, activities);
          });
        });
      });
    });
  },
  processUpdated: function(stripe_event, bull, callback) {
    var stripe_plan = stripe_event.data.object;
    var received_at = new Date(stripe_event.created*1000);

    Plan.findOne({ "reference_id": stripe_plan.id}, function(err, plan) {
      if(err) { return callback(err, null) }

      StripePlanParser.parse(bull, stripe_plan, function(err, plan) {
        if(err) { return callback(err, null) }

        var message_bull= "Your plan, " + plan.name + ", was updated.";

        StripeEventHelper.notifyUsers("plan_updated", bull, null, plan, message_bull, null, source, received_at, function(err, activities) {
          callback(err, plan, activities);
        });
      });
    });
  }
};
