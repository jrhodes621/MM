var PlanHelper = require('../../helpers/plan_helper');
var StripeEventHelper = require('../../helpers/stripe_event_helper');
var Plan = require('../../models/plan');
const source = "Stripe";

module.exports = {
  processCreated: function(stripe_event, bull, callback) {
    let stripe_plan = stripe_event.raw_object.data.object;
    let received_at = new Date(stripe_event.raw_object.created*1000);

    Plan.findOne({ "reference_id": stripe_plan.id}, function(err, plan) {
      if(err) { return callback(err, null) }

      PlanHelper.parsePlanFromStripe(plan, bull, stripe_plan, function(err, plan) {
        if(err) { return callback(err, null) }

        var message_bull= "A new plan, " + plan.name + ", was created!";

        StripeEventHelper.notifyUsers("plan_created", bull, null, plan, message_bull, null, source, received_at, function(err, plan) {
          callback(err, plan);
        });
      });
    });
  },
  processDeleted: function(stripe_event, bull, callback) {
    let stripe_plan = stripe_event.raw_object.data.object;
    let received_at  = new Date(stripe_event.raw_object.created*1000);

    Plan.findOne({ "reference_id": stripe_plan.id}, function(err, plan) {
      if(err) { return callback(err, null) }

      PlanHelper.archivePlan(plan, function(err, plan) {
        if(err) { return callback(err, null) }

        var message_bull= "Your plan, " + plan.name + ", was deleted.";

        StripeEventHelper.notifyUsers("plan_deleted", bull, null, plan, message_bull, null, source, received_at, function(err, plan) {
          callback(err, plan);
        });
      });
    });
  },
  processUpdated: function(stripe_event, bull, callback) {
    let stripe_plan = stripe_event.raw_object.data.object;
    let received_at = new Date(stripe_event.raw_object.created*1000);

    Plan.findOne({ "reference_id": stripe_plan.id}, function(err, plan) {
      if(err) { return callback(err, null) }

      PlanHelper.parsePlanFromStripe(plan, bull, stripe_plan, function(err, plan) {
        if(err) { return callback(err, null) }

        var message_bull= "Your plan, " + plan.name + ", was updated.";

        StripeEventHelper.notifyUsers("plan_updated", bull, null, plan, message_bull, null, source, received_at, function(err, plan) {
          callback(err, plan);
        });
      });
    });
  }
};
