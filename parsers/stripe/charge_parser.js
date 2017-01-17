var Charge                    = require('../../models/charge');
var PaymentCard               = require('../../models/payment_card');
var async                     = require("async");
var StripeCustomerCardParser  = require('../../parsers/stripe/customer_card_parser');


function parse(membership, stripe_charge, status, callback) {
  var result = null;
  async.waterfall([
    function getCharge(callback) {
      Charge.findOne({"reference_id": stripe_charge.id}, callback);
    },
    function getPaymentCard(charge, callback) {
      PaymentCard.findOne({"reference_id": stripe_charge.source.id}, function(err, payment_card) {
        callback(err, payment_card, charge);
      });
    },
    function parsePaymentCard(payment_card, charge, callback) {
      if(!payment_card) {
        StripeCustomerCardParser.parse(stripe_charge.source, function(err, payment_card) {
          callback(err, payment_card, charge);
        });
      } else {
        callback(null, payment_card, charge);
      }
    },
    function parseCharge(payment_card, charge, callback) {
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
      charge.status = status;
      charge.membership = membership._id;
      charge.payment_card = payment_card;

      charge.save(function(err) {
        result = charge;

        callback(err, charge);
      });
    }
  ], function(err) {
    callback(err, result);
  });
}

module.exports = {
  parse
}
