var PaymentCard = require('../models/payment_card');

function parsePaymentCardFromStripe(user, payment_card, stripe_card, callback) {
  if(!payment_card) {
    payment_card = new PaymentCard();
  }

  payment_card.reference_id = stripe_card.id;
  payment_card.name = stripe_card.name;
  payment_card.brand = stripe_card.brand;
  payment_card.last4 = stripe_card.last4;
  payment_card.exp_month = stripe_card.exp_month;
  payment_card.exp_year = stripe_card.exp_year;
  payment_card.status = "Active";

  payment_card.save(function(err) {
    if(err) { callback(err, user, null); }

    if(user.payment_cards.indexOf(payment_card._id) === -1) {
      user.payment_cards.push(payment_card);

      user.save(function(err) {
        callback(err, user, payment_card)
      })
    } else {
      callback(err, user, payment_card);
    }
  });
}
module.exports = {
  archivePaymentCard: function(user, payment_card, stripe_card, callback) {
    parsePaymentCardFromStripe(user, payment_card, stripe_card, function(err, user, payment_card) {
      if(!payment_card) { return callback(new Error("Can't create payment card"), user, payment_card); }

      payment_card.archive = true;
      payment_card.save(function(err) {
        callback(err, user, payment_card);
      });
    });
  },
  parsePaymentCardFromStripe: function(user, payment_card, stripe_card, callback) {
    parsePaymentCardFromStripe(user, payment_card, stripe_card, function(err, user, payment_card) {
      callback(err, user, payment_card);
    });
  }),
  parseSources: function(customer, user, callback) {
    var numberOfSources = customer.sources.data.length;
    customer.sources.data.forEach(function(source) {
      var paymentCard = new PaymentCard();

      paymentCard.reference_id = source.id;
      paymentCard.name = source.name;
      paymentCard.brand = source.brand;
      paymentCard.last4 = source.last4;
      paymentCard.exp_month = source.exp_month;
      paymentCard.exp_year = source.exp_year;
      paymentCard.status = "Active";

      paymentCard.save(function(err) {
        if(err) { throw err; }

        numberOfSources -= 1;
        user.payment_cards.push(paymentCard);

        if(numberOfSources == 0) {
          callback(err, user)
        }
      });
    });
  },
  addPaymentCard: function(user, reference_id, name, brand, card_last_four, expiration_month, expiration_year, status, callback) {
    var paymentCard = new PaymentCard();

    paymentCard.reference_id = reference_id;
    paymentCard.name = name;
    paymentCard.brand = brand;
    paymentCard.last4 = card_last_four;
    paymentCard.exp_month = expiration_month;
    paymentCard.exp_year = expiration_year;
    paymentCard.status = "Active";

    paymentCard.save(function(err) {
      callback(err, paymentCard)
    });
  }
};
