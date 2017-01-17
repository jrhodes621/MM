var PaymentCard = require('../models/payment_card');

var PaymentCardServices = {
  GetPaymentCardById: function(payment_card_id, callback) {
    this.findById(coupon_id)
    .exec(callback);
  },
  GetPaymentCardByReferenceId: function(reference_id, callback) {
    this.findOne({ "reference_id": reference_id })
    .exec(callback);
  },
  SavePaymentCard: function(payment_card, callback) {
    payment_card.save(function(err) {
      if(err) { console.log(err); }

      callback(err);
    });
  },
  ArchivePaymentCard: function(user, payment_card, stripe_card, callback) {
    parsePaymentCardFromStripe(user, payment_card, stripe_card, function(err, user, payment_card) {
      if(!payment_card) { return callback(new Error("Can't create payment card"), user, payment_card); }

      payment_card.archive = true;
      payment_card.save(function(err) {
        callback(err, user, payment_card);
      });
    });
  },
  AddPaymentCard: function(user, reference_id, name, brand, card_last_four, expiration_month, expiration_year, status, callback) {
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
}

module.exports = PaymentCardServices
