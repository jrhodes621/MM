var StripeEventHelper           = require('../../helpers/stripe_event_helper');
var StripeServices              = require('../../services/stripe.services');
const FormatCurrency            = require('format-currency')

module.exports = {
  processCreated: function(stripe_event, bull, callback) {
    // Do something with event_json
    //var event_types = ['charge.failed', 'charge.refunded', 'charge.succeeded']
    var reference_id = stripe_event.raw_object.data.object.charge;
    var amount = stripe_event.raw_object.data.object.total;
    var source = "Stripe";
    var received_at = received_at = new Date(stripe_event.raw_object.created*1000);
    var amount_formatted = FormatCurrency(amount, opts)

    var params = {
      charge_id: reference_id
    }
    Charge.GetCharge(params, function(err, charge) {
      if(err) { return callback(err, null); }
      if(!charge) { return callback(new Error("Charge not found"), null) }

      var message_calf = "A dispute for a payment in the amount of " + amount_formatted + " was created.";
      var message_bull= charge.membership.user.email_address + " create a dispute for a payment in the amount of " + amount_formatted + ".";

      StripeEventHelper.notifyUsers("charge_dispute_created", bull, charge.user, null, message_bull, message_calf, source, received_at, function(err, activities) {
        callback(err, user);
      });
    });
  },
  processClosed: function(stripe_event, bull, callback) {
    callback(new Error("Not Implmented"), null);
  },
  processUpdated: function(stripe_event, bull, callback) {
    callback(new Error("Not Implmented"), null);
  },
  processFundsWithdrawn: function(stripe_event, bull, callback) {
    callback(new Error("Not Implmented"), null);
  },
  procuessFundsReinstated: function(stripe_event, bull, callback) {
    callback(new Error("Not Implmented"), null);
  }
};
