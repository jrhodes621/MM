var StripeChargeParser    = require('../../parsers/stripe/charge_parser');
var StripeEventHelper     = require('../../helpers/stripe_event_helper');
var StripeServices = require('../../services/stripe.services');
const FormatCurrency = require('format-currency')
const source = "Stripe";

function process(event_type, stripe_charge, status, callback) {
  var received_at = new Date(stripe_event.raw_object.created*1000);
  var payment_total = stripe_charge.amount;

  var opts = { format: '%s%v %c', code: 'USD', symbol: '$' }
  var payment_total_formatted = FormatCurrency(payment_total, opts)

  var stripe_charges = [];
  stripe_charges.push(stripe_charge);

  StripeChargeParser.parse(stripe_charges, status, function(err, charge) {
    if(err) { return callback(err, charge); }

    var message_calf = "Your charge of " + payment_total_formatted + " was " + status + ".";
    var message_bull= "A charge of " + payment_total_formatted + " from " + charge.membership.user.email_address + " was " + status + ".";

    StripeEventHelper.notifyUsers(event_type, bull, charge.membership.user, null, message_bull, message_calf, source, received_at, function(err, activities) {
      callback(err, activities);
    });
  });
};
module.exports = {
  processCaptured: function(stripe_event, bull, callback) {
    var stripe_charge = stripe_event.raw_object.data.object;

    process("charge_captured", stripe_charge, "captured", function(err, activities) {
      callback(err, activities);
    });
  },
  processFailed: function(stripe_event, bull, callback) {
    var stripe_charge = stripe_event.raw_object.data.object;

    process("charge_failed", stripe_charge, "failed", function(err, activities) {
      callback(err, activities);
    });
  },
  processPending: function(stripe_event, bull, callback) {
    var stripe_charge = stripe_event.raw_object.data.object;

    process("charge_pending", stripe_charge, "pending", function(err, activities) {
      callback(err, activities);
    });
  },
  processRefunded: function(stripe_event, bull, callback) {
    var stripe_charge = stripe_event.raw_object.data.object;

    process("charge_refunded", stripe_charge, "pending", function(err, activities) {
      callback(err, activities);
    });
  },
  processSucceeded: function(stripe_event, bull, callback) {
    var stripe_charge = stripe_event.raw_object.data.object;

    process("charge_succeeded", stripe_charge, "succeeded", function(err, activities) {
      callback(err, activities);
    });
  },
  processUpdated: function(stripe_event, bull, callback) {
    var stripe_charge = stripe_event.raw_object.data.object;

    process("charge_updated", stripe_charge, "updated", function(err, activities) {
      callback(err, activities);
    });
  }
};
