var ActivityHelper = require('../../helpers/activity_helper');
var MembershipHelper = require('../../helpers/membership_helper');
var SubscriptionHelper = require('../../helpers/subscription_helper');
var StripeEventHelper = require('../../helpers/stripe_event_helper');
var StripeManager = require('../stripe_manager');

module.exports = {
  processCreated: function(stripe_event, bull, callback) {
    let stripe_card = stripe_event.raw_object.data.object;
    let customer = stripe_card.customer;
    let source = "Stripe";
    let received_at = new Date(stripe_event.raw_object.created*1000);

    User.findOne({ "reference_id": customer.id}, function(err, user) {
      if(err) { return callback(err, null); }
      if(!user) { return callback(new Error("User not found"), null); }

      PaymentCard.findOne({ "reference_id": card.id }, function(err, payment_card) {
        if(err) { return callback(err, null) }

        PaymentCardHelper.parsePaymentCardFromStripe(user, payment_card, bull, stripe_card, function(err, user, payment_card) {
          if(err) { return callback(err, null) }

          var message_calf = "A new payment card was added to your account.";
          var message_bull = user.email_address + " added a new payment card.";

          StripeEventHelper.notifyUsers("payment_card_created", bull, user, null, message_bull, message_calf, source, received_at, function(err, activities) {
            callback(err, activities);
          });
        });
      });
    });
  },
  processDeleted: function(stripe_event, bull, callback) {
    let stripe_card = stripe_event.raw_object.data.object;
    let customer = stripe_card.customer;
    let source = "Stripe";
    let received_at  = new Date(stripe_event.raw_object.created*1000);

    User.findOne({ "reference_id": customer.id}, function(err, user) {
      if(err) { return callback(err, null); }
      if(!user) { return callback(new Error("User not found"), null); }

      PaymentCard.findOne({ "reference_id": card.id }, function(err, payment_card) {
        if(err) { return callback(err, null) }

        PaymentCardHelper.archivePaymentCard(user, payment_card, stripe_card, function(err, user, payment_card) {
          if(err) { return callback(err, null) }

          var message_calf = "Your payment card was deleted.";
          var message_bull = user.email_address + " deleted a payment card.";

          StripeEventHelper.notifyUsers("payment_card_deleted", bull, user, null, message_bull, message_calf, source, received_at, function(err, activities) {
            callback(err, activities);
          });
        });
      });
    });
  },
  processUpdated: function(stripe_event, bull, callback) {
    let stripe_card = stripe_event.raw_object.data.object;
    let customer = stripe_card.customer;
    let source = "Stripe";
    let received_at = new Date(stripe_event.raw_object.created*1000);

    User.findOne({ "reference_id": customer.id}, function(err, user) {
      if(err) { return callback(err, null); }
      if(!user) { return callback(new Error("User not found"), null); }

      PaymentCard.findOne({ "reference_id": card.id }, function(err, payment_card) {
        if(err) { return callback(err, null) }

        PaymentCardHelper.parsePaymentCardFromStripe(user, payment_card, bull, stripe_card, function(err, user, payment_card) {
          if(err) { return callback(err, null) }

          var message_calf = "Your payment card was updated.";
          var message_bull = user.email_address + " updated a new payment card.";

          StripeEventHelper.notifyUsers("payment_card_updated", bull, user, null, message_bull, message_calf, source, received_at, function(err, activities) {
            callback(err, activities);
          });
        });
      });
    });
  }
};
