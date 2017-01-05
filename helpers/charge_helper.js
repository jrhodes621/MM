var Charge = require('../models/charge');
var PaymentCard = require('../models/payment_card');
var StripeManager = require('./stripe_manager');
var async = require("async");

function getPaymentCardForCharge(charge, reference_id, callback) {
    PaymentCard.findOne({ 'reference_id': reference_id }, function(err, payment_card) {
      callback(err, payment_card);
    });
}
module.exports = {
  getCharge: function(charge_id, callback) {
    Subscription.findOne({ "reference_id": charge_id })
    .populate('user')
    .exec(function(err, charge) {
      callback(err, charge)
    })
  },
  parse: function(user, stripe_charges, membership, callback) {
    var all_charges = [];

    async.eachSeries(stripe_charges.data, function(stripe_charge, callback) {
      async.waterfall([
        function getCharge(callback) {
          Charge.findOne({"reference_id": stripe_charge.id}, callback);
        },
        function getPaymentCard(charge, callback) {
          getPaymentCardForCharge(charge, stripe_charge.source.id, function(err, payment_card) {
            callback(err, charge, payment_card);
          });
        },
        function parseCharge(charge, payment_card, callback) {
          if(!charge) {
            charge = new Charge();
          }
          charge.reference_id = stripe_charge.id;
          charge.amount = stripe_charge.amount/100.0;
          charge.amount_refunded = stripe_charge.amount_refunded;
          charge.balance_transaction = stripe_charge.balance_transaction;
          charge.captured = stripe_charge.captured;
          charge.charge_created = new Date(stripe_charge.created * 1000);
          charge.currency = stripe_charge.currency;
          charge.description = stripe_charge.description;
          charge.destination = stripe_charge.destination;
          charge.dispute = stripe_charge.dispute;
          charge.failure_code = stripe_charge.failure_code;
          charge.failure_message = stripe_charge.failure_message;
          charge.invoice = stripe_charge.invoice;
          charge.paid = stripe_charge.paid;
          charge.receipt_email = stripe_charge.receipt_email;
          charge.receipt_number = stripe_charge.receipt_number;
          charge.refunded = stripe_charge.refunded;
          charge.shipping = stripe_charge.shipping;
          charge.source_transfer = stripe_charge.source_transfer;
          charge.statement_descriptor = stripe_charge.statement_descriptor;
          charge.status = stripe_charge.status;
          charge.membership = membership._id;
          charge.payment_card = payment_card;
          charge.user = user;

          charge.save(function(err) {
            callback(err, charge);
          });
        }
      ], function(err, charges) {
        all_charges.push(charges);

        callback(err, charges);
      });
    }, function(err) {
      callback(err, all_charges);
    });
  }
}
