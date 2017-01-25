var StripeEventHelper         = require('../../helpers/stripe_event_helper');
var StripeCustomerParser      = require('../../parsers/stripe/customer_parser');
var Membership                = require('../../models/membership');
var User                      = require('../../models/user');
var async                     = require('async');
const source                  = "Stripe";

module.exports = {
  processCreated: function(stripe_event, bull, callback) {
    var stripe_customer = stripe_event.data.object;
    var received_at = new Date(stripe_event.created*1000);

    User.findOne({ "reference_id": stripe_customer.id}, function(err, user) {
      if(err) { return callback(err, null); }

      StripeCustomerParser.parse(bull, stripe_customer, function(err, user) {
        if(err) { return callback(err, null); }

        var message_bull = "You have a new customer. " + user.email_address + " signed up!";
        var message_calf = null;

        StripeEventHelper.notifyUsers("customer_created", bull, user, null, message_bull, message_calf, source, received_at, function(err, activities) {
          callback(err, user, activities);
        });
      });
    });
  },
  processDeleted: function(stripe_event, bull, callback) {
    var stripe_customer = stripe_event.data.object;
    var received_at = new Date(stripe_event.created*1000);

    User.findOne({ "reference_id": stripe_customer.id}, function(err, user) {
      if(err) { return callback(err, null); }

      StripeCustomerParser.parse(bull, stripe_customer, function(err, user) {
        Membership.findOneAndRemove({ "user": user, "account": bull }, function(err, membership) {
          if(err) { return callback(err, null); }

          user.memberships.pull(membership._id);

          user.save((err) => {
            if(err) { return callback(err, null); }

            var message_bull= "Your customer " + user.email_address + " was deleted!";
            var message_calf = null;

            StripeEventHelper.notifyUsers("customer_deleted", bull, user, null, message_bull, null, source, received_at, function(err, activities) {
              callback(err, user, activities);
            });
          });
        });
      });
    });
  },
  processUpdated: function(stripe_event, bull, callback) {
    var stripe_customer = stripe_event.data.object;
    var received_at = new Date(stripe_event.created*1000);

    User.findOne({ "reference_id": stripe_customer.id}, function(err, user) {
      if(err) { return callback(err, null); }

      StripeCustomerParser.parse(bull, stripe_customer, function(err, user) {
        if(err) { return callback(err, null); }

        var message_bull= "Your customer " + user.email_address + " was updated!";
        var message_calf = null;

        StripeEventHelper.notifyUsers("customer_updated", bull, user, null, message_bull, message_calf, source, received_at, function(err, activities) {
          callback(err, user, activities);
        });
      });
    });
  }
};
