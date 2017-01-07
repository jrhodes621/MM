var Account = require('../../models/account');
var User = require('../../models/user');
var ActivityHelper = require('../../helpers/activity_helper');
var MembershipHelper = require('../../helpers/membership_helper');
var PushNotificationHelper = require('../../helpers/push_notification_helper');
var SubscriptionHelper = require('../../helpers/subscription_helper');
var StripeManager = require('../stripe_manager');
const FormatCurrency = require('format-currency');

module.exports = {
  process: function(stripe_event, callback) {
    // Do something with event_json
    //var event_types = ['charge.failed', 'charge.refunded', 'charge.succeeded']
    var account_id = stripe_event.raw_object.user_id;
    var reference_id = stripe_event.raw_object.data.object.customer;
    var invoice_id = stripe_event.raw_object.data.object.id;
    var subscription_id = stripe_event.raw_object.data.object.subscription;
    var payment_total = stripe_event.raw_object.data.object.total;

    // now include the currency symbol
    let opts = { format: '%s%v %c', code: 'USD', symbol: '$' }
    let payment_total_formatted = FormatCurrency(payment_total, opts)

    var source = "Stripe";
    var received_at = received_at = new Date(stripe_event.raw_object.created*1000);

    Account.findOne({"reference_id": account_id}, function(err, account) {
      if(err) { return callback(err, null); }

      User.find({ "account": account }, function(err, users) {
        if(err) { return callback(err, null); }

        MembershipHelper.getMembershipByReference(reference_id, function(err, membership) {
          if(err) { return callback(err, null); }
          if(!membership) { return callback(new Error("Calf not found"), null) }

          var stripe_api_key = membership.account.stripe_connect.access_token;

          StripeManager.getInvoice(stripe_api_key, invoice_id, function(err, stripe_invoice) {
            if(err) { return callback(err, null); }
            if(!stripe_invoice) { return callback(new Error("Invoice not found"), null) }

            var subscription_id = stripe_invoice.subscription;

            SubscriptionHelper.getSubscription(subscription_id, function(err, subscription) {
              if(err) { return callback(err, null); }
              if(!subscription) { return callback(new Error("Subscription not found"), null) }

              var message_calf = "Your payment of " + payment_total_formatted + " for " + subscription.plan.name + " was successful.";
              var message_bull= "You received a payment of " + payment_total_formatted + " for " + subscription.plan.name + " from " + membership.user.email_address + ".";

              var payload = {'messageFrom': 'MemberMoose',
                            'type': "payment_succeeded"};

              user.forEach(function(user) {
                user.devices.forEach(function(device) {
                  console.log("sending push to " + device.token);

                  PushNotificationHelper.sendPushNotification(device, message_bull, payload);
                });

                ActivityHelper.createActivity(user, membership.user, subscription.plan, "payment_processed", message_calf, message_bull,
                  source, received_at, function(err, activity) {
                    callback(err, activity);
                });
              });
            });
          });
        });
      });
    });
  }
};
