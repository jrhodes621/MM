var ActivityHelper = require('../../helpers/activity_helper');
var CustomerHelper = require('../../helpers/customer_parser');
var MembershipHelper = require('../../helpers/membership_helper');
var PushNotificationHelper = require('../../helpers/push_notification_helper');
var SubscriptionHelper = require('../../helpers/subscription_helper');
var StripeManager = require('../stripe_manager');
var User = require('../../models/user');

const FormatCurrency = require('format-currency')

module.exports = {
  processCreated: function(stripe_event, bull, callback) {
    var stripe_customer = stripe_event.raw_object.data.object;
    var source = "Stripe";
    var received_at = new Date(stripe_event.raw_object.created*1000);

    User.findOne({ "reference_id": stripe_customer.id}, function(err, user) {
      if(err) { return callback(err, null); }
      if(!user) {
        CustomerHelper.parseCustomerFromStripe(bull, stripe_customer, function(err, user) {
          callback(err, user);

          var message_calf = "";
          var message_bull= "You have a new customer. " + user.email + " signed up!";
          var payload = {'messageFrom': 'MemberMoose',
                        'type': "customer_created"};

          User.find({ "account": bull}, function(err, bull_users) {
            bull_users.forEach(function(bull_user) {
              var devices = user.devices;
              devices.forEach(function(device) {
                PushNotificationHelper.sendPushNotification(device, message_bull, payload);
              });

              ActivityHelper.createActivity(bull_user, user, null, "customer_created", message_calf, message_bull,
                source, received_at, function(err, activity) {
                  callback(err, activity);
              });
            });
          });
        });
      } else {
        console.log(user);
        callback(new Error("Customer already exists"), null)
      }
    })
  },
  processDeleted: function(stripe_event, callback) {
    let reference_id = stripe_event.raw_object.data.object.charge;
    var source = "Stripe";
    var received_at = received_at = new Date(stripe_event.raw_object.created*1000);

    //find customer with the stripe customer_id
    //if found update membership to mark deleted
    callback(new Error("Not Implmented"), null);
  },
  processUpdated: function(stripe_event, callback) {
    let reference_id = stripe_event.raw_object.data.object.charge;
    var source = "Stripe";
    var received_at = received_at = new Date(stripe_event.raw_object.created*1000);

    //find customer with the stripe customer id
    //if found update it, create it and log activity
    //if not found, create it and log activity
    callback(new Error("Not Implmented"), null);
  }
};
