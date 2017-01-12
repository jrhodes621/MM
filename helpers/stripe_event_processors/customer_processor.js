var StripeEventHelper         = require('../../helpers/stripe_event_helper');
var StripeCustomerParser      = require('../../parsers/stripe/customer_parser');
var Membership                = require('../../models/membership');
var User                      = require('../../models/user');
var async                     = require("async");
const source                  = "Stripe";

function process(event_type, bull, stripe_customer, message_calf, message_bull, received_at) {
  User.findOne({ "reference_id": stripe_customer.id}, function(err, user) {
    if(err) { return callback(err, null); }

    StripeCustomerParser.parser(bull, stripe_customer, function(err, user) {
      if(err) { return callback(err, null); }

      StripeEventHelper.notifyUsers(event_type, bull, user, null, message_bull, message_calf, source, received_at, function(err, activities) {
        callback(err, user);
      });
    });
  });
}
module.exports = {
  processCreated: function(stripe_event, bull, callback) {
    var stripe_customer = stripe_event.raw_object.data.object;
    var received_at = new Date(stripe_event.raw_object.created*1000);

    var message_bull= "You have a new customer. " + user.email_address + " signed up!";

    process("customer_created", bull, stripe_customer, null, message_bull, received_at, function(err, activities) {
      callback(err, activities);
    });
  },
  processDeleted: function(stripe_event, bull, callback) {
    var stripe_customer = stripe_event.raw_object.data.object;
    var received_at = new Date(stripe_event.raw_object.created*1000);

    User.findOne({ "reference_id": stripe_customer.id}, function(err, user) {
      if(err) { return callback(err, null); }
      if(!user) { return callback(null, null); }

      Membership.findOneAndRemove({ "user": user, "account": bull }, function(err, membership) {
        if(err) { return callback(err, null); }

        user.memberships.pull(membership._id);

        user.save(function(err) {
          if(err) { return callback(err, null); }

          var message_bull= "Your customer " + user.email_address + " was deleted!";

          StripeEventHelper.notifyUsers("customer_deleted", bull, user, null, message_bull, null, source, received_at, function(err, activities) {
            callback(err, user);
          });
        });
      })
    });
  },
  processUpdated: function(stripe_event, bull, callback) {
    var stripe_customer = stripe_event.raw_object.data.object;
    var received_at = new Date(stripe_event.raw_object.created*1000);

    var message_bull= "Your customer " + user.email_address + " was updated!";

    process("customer_updated", bull, stripe_customer, null, message_bull, received_at, function(err, activities) {
      callback(err, activities);
    });
  }
};
