var Subscription            = require('../../models/subscription');
var StripeServices          = require('../../services/stripe.services');
var StripeEventHelper       = require('../../helpers/stripe_event_helper');

const FormatCurrency        = require('format-currency')

module.exports = {
  processCreated: function(stripe_event, bull, callback) {
    var reference_id = stripe_event.raw_object.data.object.customer;
    var invoice_id = stripe_event.raw_object.data.object.id;
    var subscription_id = stripe_event.raw_object.data.object.subscription;
    var payment_total = stripe_event.raw_object.data.object.total;

    var opts = { format: '%s%v %c', code: 'USD', symbol: '$' }
    var payment_total_formatted = FormatCurrency(payment_total, opts)

    var source = "Stripe";
    var received_at = received_at = new Date(stripe_event.raw_object.created*1000);

    Membership.findOne({ "reference_id": reference_id }, function(err, membership) {
      if(err) { return callback(err, null); }
      if(!membership) { return callback(new Error("Calf not found"), null) }

      Subscription.GetSubscriptionByReferenceId({ "reference_id": stripe_invoice.subscription }, function(err, subscription) {
        if(err) { return callback(err, null); }
        if(!subscription) { return callback(new Error("Subscription not found"), null) }

        var message_calf = "You have a new invoice in the amount of " + payment_total_formatted + " for " + subscription.plan.name + " is ready.";
        var message_bull= "A new invoice for created for " + membership.user.email_address + " in the amount of " + payment_total_formatted + " for " + subscription.plan.name + ".";

        StripeEventHelper.notifyUsers("invoice_created", bull, membership.user, subscription.plan, message_bull, message_calf, source, received_at, function(err, activities) {
          callback(err, activities);
        });
      });
    });
  },
  processPaymentFailed: function(stripe_event, bull, callback) {
    var customer_id = stripe_event.raw_object.data.object.customer;
    var invoice_id = stripe_event.raw_object.data.object.id;
    var subscription_id = stripe_event.raw_object.data.object.subscription;
    var payment_id = stripe_event.raw_object.data.object.payment;

    var opts = { format: '%s%v %c', code: 'USD', symbol: '$' }
    var payment_total_formatted = FormatCurrency(payment_total, opts)

    Membership.findOne({ "reference_id": customer_id }, function(err, membership) {
      if(err) { return callback(err, null); }
      if(!membership) { return callback(new Error("Calf not found"), null) }

      Subscription.GetSubscriptionByReferenceId({ "reference_id": stripe_invoice.subscription }, function(err, subscription) {
        if(err) { return callback(err, null); }
        if(!subscription) { return callback(new Error("Subscription not found"), null) }

        var message_calf = "Your payment in the amount of " + payment_total_formatted + " for " + subscription.plan.name + " failed.";
        var message_bull= "Payment failed for " + membership.user.email_address + " in the amount of " + payment_total_formatted + " for " + subscription.plan.name + ".";

        StripeEventHelper.notifyUsers("invoice_payment_failed", bull, user, subscription.plan, message_bull, message_calf, source, received_at, function(err, activities) {
          callback(err, activities);
        });
      })
    });
  },
  processPaymentSucceeded: function(stripe_event, bull, callback) {
    var customer_id = stripe_event.raw_object.data.object.customer;
    var invoice_id = stripe_event.raw_object.data.object.id;
    var subscription_id = stripe_event.raw_object.data.object.subscription;
    var payment_id = stripe_event.raw_object.data.object.payment;

    var opts = { format: '%s%v %c', code: 'USD', symbol: '$' }
    var payment_total_formatted = FormatCurrency(payment_total, opts)

    var source = "Stripe";
    var received_at = received_at = new Date(stripe_event.raw_object.created*1000);

    Membership.findOne({ "reference_id": reference_id }, function(err, membership) {
      if(err) { return callback(err, null); }
      if(!membership) { return callback(new Error("Calf not found"), null) }

      Subscription.GetSubscriptionByReferenceId({ "reference_id": stripe_invoice.subscription }, function(err, subscription) {
        if(err) { return callback(err, null); }
        if(!subscription) { return callback(new Error("Subscription not found"), null) }

        var message_calf = "Your payment of " + payment_total_formatted + " for " + subscription.plan.name + " was successful.";
        var message_bull= "You received a payment of " + payment_total_formatted + " for " + subscription.plan.name + " from " + membership.user.email_address + ".";

        StripeEventHelper.notifyUsers("invoice_payment_processed", bull, membership.user, subscription.plan, message_bull, message_calf, source, received_at, function(err, activities) {
          callback(err, activities);
        });
      });
    });
  },
  processSent(stripe_event, bull, callback) {
    var customer_id = stripe_event.raw_object.data.object.customer;
    var invoice_id = stripe_event.raw_object.data.object.id;
    var subscription_id = stripe_event.raw_object.data.object.subscription;
    var payment_id = stripe_event.raw_object.data.object.payment;

    var opts = { format: '%s%v %c', code: 'USD', symbol: '$' }
    var payment_total_formatted = FormatCurrency(payment_total, opts)

    var source = "Stripe";
    var received_at = received_at = new Date(stripe_event.raw_object.created*1000);

    Membership.findOne({ "reference_id": reference_id }, function(err, membership) {
      if(err) { return callback(err, null); }
      if(!membership) { return callback(new Error("Calf not found"), null) }

      Subscription.GetSubscriptionByReferenceId({ "reference_id": stripe_invoice.subscription }, function(err, subscription) {
        if(err) { return callback(err, null); }
        if(!subscription) { return callback(new Error("Subscription not found"), null) }

        var message_calf = "Your invoice in the amount of " + payment_total_formatted + " for " + subscription.plan.name + " was sent.";
        var message_bull= "The invoice for " + membership.user.email_address + " in the amount of " + payment_total_formatted + " for " + subscription.plan.name + " was sent.";

        StripeEventHelper.notifyUsers("invoice_sent", bull, membership.user, subscription.plan, message_bull, message_calf, source, received_at, function(err, activities) {
          callback(err, activities);
        });
      });
    });
  },
  processUpdated(stripe_event, bull, callback) {
    var reference_id = stripe_event.raw_object.data.object.customer;
    var invoice_id = stripe_event.raw_object.data.object.id;
    var subscription_id = stripe_event.raw_object.data.object.subscription;
    var payment_total = stripe_event.raw_object.data.object.total;

    var opts = { format: '%s%v %c', code: 'USD', symbol: '$' }
    var payment_total_formatted = FormatCurrency(payment_total, opts)

    var source = "Stripe";
    var received_at = received_at = new Date(stripe_event.raw_object.created*1000);

    Membership.findOne({ "reference_id": reference_id }, function(err, membership) {
      if(err) { return callback(err, null); }
      if(!membership) { return callback(new Error("Calf not found"), null) }

      Subscription.GetSubscriptionByReferenceId({ "reference_id": stripe_invoice.subscription }, function(err, subscription) {
        if(err) { return callback(err, null); }
        if(!subscription) { return callback(new Error("Subscription not found"), null) }

        var message_calf = "Your invoice in the amount of " + payment_total_formatted + " for " + subscription.plan.name + " was updated.";
        var message_bull= "The invoice for " + membership.user.email_address + " in the amount of " + payment_total_formatted + " for " + subscription.plan.name + " was updated.";

        StripeEventHelper.notifyUsers("invoice_updated", bull, membership.user, subscription.plan, message_bull, message_calf, source, received_at, function(err, activities) {
          callback(err, activities);
        });
      });
    });
  }
};
