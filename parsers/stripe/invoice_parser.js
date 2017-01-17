var Membership          = require('../../models/membership');
var Charge              = require('../../models/charge');
var Discount            = require('../../models/discount');
var Invoice             = require('../../models/invoice');
var Subscription        = require('../../models/subscription');
var PaymentCard         = require('../../models/payment_card');

var ChargeParser        = require('../../parsers/stripe/charge_parser');
var SubscriptionParser  = require('../../parsers/stripe/customer_subscription_parser');

var StripeServices      = require('../../services/stripe.services');

var async               = require("async");

function parse(bull, stripe_invoice, membership, callback) {
  var result = null;
  var stripe_api_key = bull.stripe_connect.access_token;

  async.waterfall([
    function getMembership(callback) {
      if(!membership) {
        Membership.findOne({ "reference_id": stripe_invoice.customer }, function(err, membership) {
          if(!membership) { return callback(new Error("Unable to find customer"), null); }

          callback(err, membership);
        });
      } else {
        callback(null, membership);
      }
    },
    function getCharge(membership, callback) {
      if(stripe_invoice.charge) {
        Charge.findOne({"reference_id": stripe_invoice.charge }, function(err, charge) {
          if(!charge) {
            StripeServices.getCharge(stripe_api_key, stripe_invoice.charge, function(err, stripe_charge) {
              if(err) { return callback(err, null, membership); }
              if(!stripe_charge) { return callback(new Error("Unable to retrieve charge from Stripe"), null, membership); }

              ChargeParser.parse(membership, stripe_charge, "Active", function(err, charge) {
                callback(err, charge, membership);
              });
            });
          } else {
            callback(null, null, membership);
          }
        });
      } else {
        callback(null, null, membership);
      }
    },
    function getSubscription(charge, membership, callback) {
      if(stripe_invoice.subscription) {
        Subscription.findOne({ "reference_id": stripe_invoice.subscription }, function(err, subscription) {
          callback(null, subscription, charge, membership);
        });
      } else {
        callback(null, null, charge, membership);
      }
    },
    function getDiscount(subscription, charge, membership, callback) {
      if(stripe_invoice.discount) {
        Discount.findOne({ "reference_id": stripe_invoice.discount }, function(err, discount) {
          callback(err, discount, subscription, charge, membership);
        });
      } else {
        callback(null, null, subscription, charge, membership);
      }
    },
    function getInvoice(discount, subscription, charge, membership, callback) {
      Invoice.findOne({ "reference_id": stripe_invoice.id }, function(err, invoice) {
        callback(err, invoice, subscription, charge, membership);
      });
    },
    function parseInvoice(invoice, subscription, charge, membership, callback) {
      if(!invoice) {
        invoice = new Invoice();
      }

      invoice.membership = membership;
      invoice.reference_id = stripe_invoice.id;
      invoice.amount_due = stripe_invoice.amount_due;
      invoice.application_fee = stripe_invoice.application_fee;
      invoice.attempt_count = stripe_invoice.attempt_count;
      invoice.attempted = stripe_invoice.attempted;
      invoice.charge = charge;
      invoice.closed = stripe_invoice.closed;
      invoice.currency = stripe_invoice.currency;
      invoice.invoice_date = stripe_invoice.date;
      invoice.description = stripe_invoice.description;
      //invoice.discount = stripe_invoice.discount;
      invoice.ending_balance = stripe_invoice.ending_balance || 0;
      invoice.forgiven = stripe_invoice.forgiven;
      //invoice.lines.push
      invoice.next_payment_attempt = stripe_invoice.next_payment_attempt;
      invoice.paid = stripe_invoice.paid;
      invoice.period_end = stripe_invoice.period_end;
      invoice.period_start = stripe_invoice.period_start;
      invoice.statement_descriptor = stripe_invoice.statement_descriptor;
      invoice.subscription = subscription;
      invoice.subtotal = stripe_invoice.subtotal;
      invoice.tax = stripe_invoice.tax;
      invoice.tax_percent = stripe_invoice.tax_percent;
      invoice.total = stripe_invoice.total;

      invoice.save(function(err) {
        result = invoice;

        callback(err);
      });
    }
  ], function(err) {
    callback(err, result);
  });
}

module.exports = {
  parse
}
