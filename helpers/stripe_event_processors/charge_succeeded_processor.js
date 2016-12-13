var ActivityHelper = require('../../helpers/activity_helper');
var MembershipHelper = require('../../helpers/membership_helper');
var SubscriptionHelper = require('../../helpers/subscription_helper');
var StripeManager = require('../stripe_manager');

module.exports = {
  process: function(stripe_event, callback) {
    // Do something with event_json
    //var event_types = ['charge.failed', 'charge.refunded', 'charge.succeeded']
    var reference_id = stripe_event.raw_object.data.object.customer;
    var invoice_id = stripe_event.raw_object.data.object.invoice;
    var source = "Stripe";
    var received_at = received_at = new Date(stripe_event.raw_object.created*1000);

    MembershipHelper.getMembershipByReference(reference_id, function(err, membership) {
      if(err) { return callback(err, null); }
      if(!membership) { return callback(new Error("Calf not found"), null) }

      var stripe_api_key = membership.account.stripe_connect.access_token;

      //find invoice
      StripeManager.getInvoice(stripe_api_key, invoice_id, function(err, stripe_invoice) {
        var subscription_id = stripe_invoice.subscription;

        SubscriptionHelper.getSubscription(subscription_id, function(err, subscription) {
          if(err) { return callback(err, null); }
          if(!subscription) { return callback(new Error("Subscription not found"), null) }

          var message_calf = "Your payment of $4.00 for " + subscription.plan.name + " was successfully processed.";
          var message_bull= "You received a payment of $4.00 for " + subscription.plan.name + " from " + membership.user.email + ".";

          ActivityHelper.createActivity(subscription.plan.user, membership.user, subscription.plan, "payment_processed", message_calf, message_bull,
            source, received_at, function(err, activity) {
              callback(err, activity);
          });
        });
      });
    });
  }
};
