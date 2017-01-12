var PaymentCardParser       = require('../../parsers/stripe/customer_card_parser');
var StripeEventHelper       = require('../../helpers/stripe_event_helper');
var StripeServices          = require('../../services/stripe.services');
var PaymentCard             = require('../../models/payment_card');
var User                    = require('../../models/user');

const source = "Stripe";

function process(bull, stripe_card, message_calf, message_bull, received_at, callback) {
  var customer = stripe_card.customer;

  User.findOne({ "reference_id": customer.id}, function(err, user) {
    if(err) { return callback(err, null); }
    if(!user) { return callback(new Error("User not found"), null); }

    var stripe_cards = [];
    stripe_cards.push(stripe_card);

    PaymentCardParser.parse(user, stripe_cards, function(err, user, payment_card) {
      if(err) { return callback(err, null) }

      StripeEventHelper.notifyUsers("payment_card_created", bull, user, null, message_bull, message_calf, source, received_at, function(err, activities) {
        callback(err, activities);
      });
    });
  });
}
module.exports = {
  processCreated: function(stripe_event, bull, callback) {
    var stripe_card = stripe_event.raw_object.data.object;
    var received_at = new Date(stripe_event.raw_object.created*1000);

    var message_calf = "A new payment card was added to your account.";
    var message_bull = user.email_address + " added a new payment card.";

    process(bull, stripe_card, message_calf, message_bull, received_at, function(err, activites) {
      callback(err, activities);
    });
  },
  processDeleted: function(stripe_event, bull, callback) {
    var stripe_card = stripe_event.raw_object.data.object;
    var customer = stripe_card.customer;
    var received_at  = new Date(stripe_event.raw_object.created*1000);

    User.findOne({ "reference_id": customer.id}, function(err, user) {
      if(err) { return callback(err, null); }
      if(!user) { return callback(new Error("User not found"), null); }

      PaymentCardHelper.archivePaymentCard(user, payment_card, stripe_card, function(err, user, payment_card) {
        if(err) { return callback(err, null) }

        var message_calf = "Your payment card was deleted.";
        var message_bull = user.email_address + " deleted a payment card.";

        StripeEventHelper.notifyUsers("payment_card_deleted", bull, user, null, message_bull, message_calf, source, received_at, function(err, activities) {
          callback(err, activities);
        });
      });
    });
  },
  processUpdated: function(stripe_event, bull, callback) {
    var stripe_card = stripe_event.raw_object.data.object;
    var received_at = new Date(stripe_event.raw_object.created*1000);

    var message_calf = "Your payment card was updated.";
    var message_bull = user.email_address + " updated a new payment card.";

    process(bull, stripe_card, message_calf, message_bull, received_at, function(err, activites) {
      callback(err, activities);
    });
  }
};
