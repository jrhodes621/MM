var Charge = require('../models/charge');
var StripeManager = require('./stripe_manager');
var Step = require('step');

module.exports = {
  getCharge: function(charge_id, callback) {
    Subscription.findOne({ "reference_id": charge_id })
    .populate('user')
    .exec(function(err, charge) {
      callback(err, charge)
    })
  },
  parse: function(stripe_charges, callback) {
    var numberOfCharges = stripe_charges.data.length;
    var charges = [];

    if(numberOfCharges == 0) {
      callback(null, []);
    }
    stripe_charges.data.forEach(function(stripe_charge) {
      //find charge
      Step(
        function getCharge() {
          Charge.findOne({"reference_id": stripe_charge.id}, this);
        },

        function parseCharge(err, charge) {
          if(err) { console.log(err); }

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

          return charge;
        },
        function doCallback(err, charge) {
          if(err) { console.log(err); }

          charges.push(charge)

          numberOfCharges -= 1;
          if(numberOfCharges == 0) {
            callback(null, charges)
          }
        }
      )
    });
  },
  saveCharges: function(user, charges, callback) {
    var numberOfCharges = charges.length;

    if(numberOfCharges == 0) {
      callback(null, []);
    }
    charges.forEach(function(charge) {
      Step(
        function saveCharge() {
          charge.user = user;

          charge.save(this);
        },
        function doCallback(err, charge) {
          if(err) { console.log(err); }

          user.charges.push(charge);

          numberOfCharges -= 1;
          if(numberOfCharges == 0) {
            callback(err, user)
          }
        }
      )
    });
  }
}
