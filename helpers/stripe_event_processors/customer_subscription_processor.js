var ActivityHelper = require('../../helpers/activity_helper');
var MembershipHelper = require('../../helpers/membership_helper');
var PushNotificationHelper = require('../../helpers/push_notification_helper');
var SubscriptionHelper = require('../../helpers/subscription_helper');
var StripeEventHelper = require('../../helpers/stripe_event_helper');
var StripeManager = require('../stripe_manager');
const FormatCurrency = require('format-currency')

module.exports = {
  processCreated: function(stripe_event, bull, callback) {
    // Do something with event_json
    //var event_types = ['charge.failed', 'charge.refunded', 'charge.succeeded']
    let reference_id = stripe_event.raw_object.data.object.customer;
    let subscription_id = stripe_event.raw_object.data.object.id;

    var source = "Stripe";
    var received_at = received_at = new Date(stripe_event.raw_object.created*1000);

    MembershipHelper.getMembershipByReference(reference_id, function(err, membership) {
      if(err) { return callback(err, null); }
      if(!membership) { return callback(new Error("Calf not found"), null) }

      var stripe_api_key = membership.account.stripe_connect.access_token;

        SubscriptionHelper.getSubscription(subscription_id, function(err, subscription) {
          if(err) { return callback(err, null); }
          if(!subscription) { return callback(new Error("Subscription not found"), null) }

          var message_calf = "You subscribed to " + subscription.plan.name + ".";
          var message_bull= membership.user.email_address + " just subscribed to   " + subscription.plan.name + ".";

          StripeEventHelper.notifyUsers("customer_subscription_created", bull, membership.user, subscription.plan, message_bull, message_calf, source, received_at, function(err, activities) {
            callback(err, activities);
          });
        });
    });
  },
  processDeleted: function(stripe_event, bull, callback) {
    // Do something with event_json
    //var event_types = ['charge.failed', 'charge.refunded', 'charge.succeeded']
    let reference_id = stripe_event.raw_object.data.object.customer;
    let subscription_id = stripe_event.raw_object.data.object.id;

    var source = "Stripe";
    var received_at = received_at = new Date(stripe_event.raw_object.created*1000);

    MembershipHelper.getMembershipByReference(reference_id, function(err, membership) {
      if(err) { return callback(err, null); }
      if(!membership) { return callback(new Error("Calf not found"), null) }

      var stripe_api_key = membership.account.stripe_connect.access_token;

        SubscriptionHelper.getSubscription(subscription_id, function(err, subscription) {
          if(err) { return callback(err, null); }
          if(!subscription) { return callback(new Error("Subscription not found"), null) }

          var message_calf = "You unsubscribed subscribed from " + subscription.plan.name + ".";
          var message_bull= membership.user.email_address + " unsubscribed from   " + subscription.plan.name + ".";

          StripeEventHelper.notifyUsers("customer_subscription_deleted", bull, membership.user, subscription.plan, message_bull, message_calf, source, received_at, function(err, activities) {
            callback(err, activities);
          });
        });
    });
  },
  processTrialWillEnd: function(stripe_event, bull, allback) {
    // Do something with event_json
    //var event_types = ['charge.failed', 'charge.refunded', 'charge.succeeded']
    let reference_id = stripe_event.raw_object.data.object.customer;
    let subscription_id = stripe_event.raw_object.data.object.id;

    var source = "Stripe";
    var received_at = received_at = new Date(stripe_event.raw_object.created*1000);

    MembershipHelper.getMembershipByReference(reference_id, function(err, membership) {
      if(err) { return callback(err, null); }
      if(!membership) { return callback(new Error("Calf not found"), null) }

      var stripe_api_key = membership.account.stripe_connect.access_token;

        SubscriptionHelper.getSubscription(subscription_id, function(err, subscription) {
          if(err) { return callback(err, null); }
          if(!subscription) { return callback(new Error("Subscription not found"), null) }

          var message_calf = "You trial period to " + subscription.plan.name + " will end in 3 days.";
          var message_bull= membership.user.email_address + "'s trial period to  " + subscription.plan.name + " will end in 3 days.";

          StripeEventHelper.notifyUsers("customer_subscription_trial_will_end", bull, membership.user, subscription.plan, message_bull, message_calf, source, received_at, function(err, activities) {
            callback(err, activities);
          });
        });
    });
  },
  processUpdated: function(stripe_event, bull, callback) {
    // Do something with event_json
    //var event_types = ['charge.failed', 'charge.refunded', 'charge.succeeded']
    let reference_id = stripe_event.raw_object.data.object.customer;
    let subscription_id = stripe_event.raw_object.data.object.id;

    var source = "Stripe";
    var received_at = received_at = new Date(stripe_event.raw_object.created*1000);

    MembershipHelper.getMembershipByReference(reference_id, function(err, membership) {
      if(err) { return callback(err, null); }
      if(!membership) { return callback(new Error("Calf not found"), null) }

      var stripe_api_key = membership.account.stripe_connect.access_token;

        SubscriptionHelper.getSubscription(subscription_id, function(err, subscription) {
          if(err) { return callback(err, null); }
          if(!subscription) { return callback(new Error("Subscription not found"), null) }

          var message_calf = "Your subscription to " + subscription.plan.name + " was updated.";
          var message_bull= membership.user.email_address + "'s subscription to   " + subscription.plan.name + " was updated.";

          StripeEventHelper.notifyUsers("customer_subscription_updated", bull, membership.user, subscription.plan, message_bull, message_calf, source, received_at, function(err, activities) {
            callback(err, activities);
          });
        });
    });
  }
};
