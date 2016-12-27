var PaymentCard = require('../models/payment_card');

module.exports = {
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
