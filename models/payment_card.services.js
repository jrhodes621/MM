const PaymentCard = require('../models/payment_card');

const PaymentCardServices = {
  GetPaymentCardById: (paymentCardId, callback) => {
    this.findById(paymentCardId)
    .exec(callback);
  },
  GetPaymentCardByReferenceId: (referenceId, callback) => {
    this.findOne({ reference_id: referenceId })
    .exec(callback);
  },
  SavePaymentCard: (paymentCard, callback) => {
    paymentCard.save(callback);
  },
  ArchivePaymentCard: (user, paymentCard, stripeCard, callback) => {
    paymentCard.archive = true;
    paymentCard.save((err) => {
      callback(err, user, paymentCard);
    });
  },
  AddPaymentCard: (user, referenceId, name, brand, cardLastFour, expirationMonth, expirationYear,
    status, callback) => {
    const paymentCard = new PaymentCard();

    paymentCard.reference_id = referenceId;
    paymentCard.name = name;
    paymentCard.brand = brand;
    paymentCard.last4 = cardLastFour;
    paymentCard.exp_month = expirationMonth;
    paymentCard.exp_year = expirationYear;
    paymentCard.status = 'Active';

    paymentCard.save((err) => {
      callback(err, paymentCard);
    });
  },
};

module.exports = PaymentCardServices;
