var ActivityHelper = require('../../helpers/activity_helper');
var CustomerHelper = require('../../helpers/customer_parser');
var MembershipHelper = require('../../helpers/membership_helper');
var PushNotificationHelper = require('../../helpers/push_notification_helper');
var StripeEventHelper = require('../../helpers/stripe_event_helper');
var SubscriptionHelper = require('../../helpers/subscription_helper');
var StripeManager = require('../stripe_manager');
var Membership = require('../../models/membership');
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

      CustomerHelper.parseCustomerFromStripe(user, bull, stripe_customer, function(err, user) {
        if(err) { return callback(err, null); }

        var message_calf = "Test Message";
        var message_bull= "You have a new customer " + user.email + " signed up!";

        StripeEventHelper.notifyUsers("customer_created", bull, user, null, message_bull, message_calf, source, received_at, function(err, activities) {
          callback(err, user);
        });
      });
    });
  },
  processDeleted: function(stripe_event, bull, callback) {
    var stripe_customer = stripe_event.raw_object.data.object;
    var source = "Stripe";
    var received_at = new Date(stripe_event.raw_object.created*1000);

    User.findOne({ "reference_id": stripe_customer.id}, function(err, user) {
      if(err) { return callback(err, null); }

      Membership.findOneAndRemove({ "user": user, "account": bull }, function(err, membership) {
        if(err) { return callback(err, null); }

        var message_calf = "Test Message";
        var message_bull= "Your customer " + user.email + " was deleted!";

        StripeEventHelper.notifyUsers("customer_deleted", bull, user, null, message_bull, message_calf, source, received_at, function(err, activities) {
          callback(err, user);
        });
      })
    });
  },
  processUpdated: function(stripe_event, bull, callback) {
    var stripe_customer = stripe_event.raw_object.data.object;
    var source = "Stripe";
    var received_at = new Date(stripe_event.raw_object.created*1000);

    User.findOne({ "reference_id": stripe_customer.id}, function(err, user) {
      if(err) { return callback(err, null); }

      CustomerHelper.parseCustomerFromStripe(user, bull, stripe_customer, function(err, user) {
        if(err) { return callback(err, null); }

        var message_calf = "Test Message";
        var message_bull= "Your customer " + user.email + " was updated!";

        StripeEventHelper.notifyUsers("customer_updated", bull, user, null, message_bull, message_calf, source, received_at, function(err, activities) {
          callback(err, user);
        });
      });
    });
  }
};
