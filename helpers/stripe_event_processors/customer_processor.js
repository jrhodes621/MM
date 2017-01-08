var ActivityHelper = require('../../helpers/activity_helper');
var CustomerHelper = require('../../helpers/customer_parser');
var MembershipHelper = require('../../helpers/membership_helper');
var PushNotificationHelper = require('../../helpers/push_notification_helper');
var StripeEventHelper = require('../../helpers/stripe_event_helper');
var SubscriptionHelper = require('../../helpers/subscription_helper');
var StripeManager = require('../stripe_manager');
var User = require('../../models/user');
var async = require("async");

const FormatCurrency = require('format-currency')

module.exports = {
  processCreated: function(stripe_event, bull, callback) {
    var stripe_customer = stripe_event.raw_object.data.object;
    var source = "Stripe";
    var received_at = new Date(stripe_event.raw_object.created*1000);

    User.findOne({ "reference_id": stripe_customer.id}, function(err, user) {
      if(err) { return callback(err, null); }

      CustomerHelper.parseNewCustomerFromStripe(user, bull, stripe_customer, function(err, user) {
        if(err) { return callback(err, null); }

        var message_calf = "Test Message";
        var message_bull= "You have a new customer " + user.email + " signed up!";

        StripeEventHelper.notifyUsers("customer_created", bull, user, null, message_bull, message_calf, "Stripe", received_at, function(err, activities) {
          callback(err, user);
        })
      });
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
