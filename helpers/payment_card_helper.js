var PaymentCard = require('../models/payment_card');

module.exports = {
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
