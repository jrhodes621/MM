var Membership           = require('../../models/membership');
var Subscription         = require('../../models/subscription');
var StripeEventHelper    = require('../../helpers/stripe_event_helper');
var StripeServices       = require('../../services/stripe.services');
const FormatCurrency     = require('format-currency');

module.exports = {
  processCreated: function(stripe_event, bull, callback) {
    // Do something with event_json
    //var event_types = ['charge.failed', 'charge.refunded', 'charge.succeeded']
    var customer_id = stripe_event.data.object.customer;
    var subscription_id = stripe_event.data.object.id;

    var source = "Stripe";
    var received_at = received_at = new Date(stripe_event.created*1000);

    Membership.GetMembershipByReferenceId(customer_id, function(err, membership) {
      if(err) { return callback(err, null); }
      if(!membership) { return callback(new Error("Calf not found"), null) }

      var stripeApiKey = membership.account.stripe_connect.access_token;

      Subscription.GetMembershipByReferenceId(subscription_id, function(err, subscription) {
        if(err) { return callback(err, null); }
        if(!subscription) { return callback(new Error("Subscription not found"), null) }

        var message_calf = "You subscribed to " + subscription.plan.name + ".";
        var message_bull= membership.user.email_address + " just subscribed to   " + subscription.plan.name + ".";

        StripeEventHelper.notifyUsers("customer_subscription_created", bull, membership.user, subscription.plan, message_bull, message_calf, source, received_at, function(err, activities) {
          console.log(subscription);
          
          callback(err, subscription, activities);
        });
      });
    });
  },
  processDeleted: function(stripe_event, bull, callback) {
    // Do something with event_json
    //var event_types = ['charge.failed', 'charge.refunded', 'charge.succeeded']
    var reference_id = stripe_event.data.object.customer;
    var subscription_id = stripe_event.data.object.id;

    var source = "Stripe";
    var received_at = received_at = new Date(stripe_event.created*1000);

    Membership.GetMembershipByReferenceId(reference_id, function(err, membership) {
      if(err) { return callback(err, null); }
      if(!membership) { return callback(new Error("Calf not found"), null) }

      var stripeApiKey = membership.account.stripe_connect.access_token;

      Subscription.GetMembershipByReferenceId(subscription_id, function(err, subscription) {
        if(err) { return callback(err, null); }
        if(!subscription) { return callback(new Error("Subscription not found"), null) }

        var message_calf = "You unsubscribed subscribed from " + subscription.plan.name + ".";
        var message_bull= membership.user.email_address + " unsubscribed from   " + subscription.plan.name + ".";

        StripeEventHelper.notifyUsers("customer_subscription_deleted", bull, membership.user, subscription.plan, message_bull, message_calf, source, received_at, function(err, activities) {
          callback(err, subscription, activities);
        });
      });
    });
  },
  processTrialWillEnd: function(stripe_event, bull, allback) {
    // Do something with event_json
    //var event_types = ['charge.failed', 'charge.refunded', 'charge.succeeded']
    var reference_id = stripe_event.data.object.customer;
    var subscription_id = stripe_event.data.object.id;

    var source = "Stripe";
    var received_at = received_at = new Date(stripe_event.created*1000);

    Membership.GetMembershipByReferenceId(reference_id, function(err, membership) {
      if(err) { return callback(err, null); }
      if(!membership) { return callback(new Error("Calf not found"), null) }

      var stripeApiKey = membership.account.stripe_connect.access_token;

      Subscription.GetSubscriptionByReferenceId(subscription_id, function(err, subscription) {
        if(err) { return callback(err, null); }
        if(!subscription) { return callback(new Error("Subscription not found"), null) }

        var message_calf = "You trial period to " + subscription.plan.name + " will end in 3 days.";
        var message_bull= membership.user.email_address + "'s trial period to  " + subscription.plan.name + " will end in 3 days.";

        StripeEventHelper.notifyUsers("customer_subscription_trial_will_end", bull, membership.user, subscription.plan, message_bull, message_calf, source, received_at, function(err, activities) {
          callback(err, subscription, activities);
        });
      });
    });
  },
  processUpdated: function(stripe_event, bull, callback) {
    // Do something with event_json
    //var event_types = ['charge.failed', 'charge.refunded', 'charge.succeeded']
    var reference_id = stripe_event.data.object.customer;
    var subscription_id = stripe_event.data.object.id;

    var source = "Stripe";
    var received_at = received_at = new Date(stripe_event.created*1000);

    Membership.GetMembershipByReferenceId(reference_id, function(err, membership) {
      if(err) { return callback(err, null); }
      if(!membership) { return callback(new Error("Calf not found"), null) }

      var stripeApiKey = membership.account.stripe_connect.access_token;

      Subscription.GetSubscriptionByReferenceId(subscription_id, function(err, subscription) {
        if(err) { return callback(err, null); }
        if(!subscription) { return callback(new Error("Subscription not found"), null) }

        var message_calf = "Your subscription to " + subscription.plan.name + " was updated.";
        var message_bull= membership.user.email_address + "'s subscription to   " + subscription.plan.name + " was updated.";

        StripeEventHelper.notifyUsers("customer_subscription_updated", bull, membership.user, subscription.plan, message_bull, message_calf, source, received_at, function(err, activities) {
          callback(err, subscription, activities);
        });
      });
    });
  }
};
