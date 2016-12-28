var ActivityHelper = require('../../helpers/activity_helper');
var MembershipHelper = require('../../helpers/membership_helper');
var PushNotificationHelper = require('../../helpers/push_notification_helper');
var SubscriptionHelper = require('../../helpers/subscription_helper');
var StripeManager = require('../stripe_manager');
const FormatCurrency = require('format-currency')

module.exports = {
  process: function(stripe_event, callback) {
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

          var payload = {'messageFrom': 'MemberMoose',
                        'type': "customer_subscription_deleted"};
          var devices = subscription.plan.user.devices;
          devices.forEach(function(device) {
            PushNotificationHelper.sendPushNotification(device, message_bull, payload);
          });

          ActivityHelper.createActivity(subscription.plan.user, membership.user, subscription.plan, "customer_subscription_deleted", message_calf, message_bull,
            source, received_at, function(err, activity) {
              callback(err, activity);
          });
        });
    });
  }
};
