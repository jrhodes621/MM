var StripeServices        = require('../../services/stripe.services');
var StripeEventHelper     = require('../../helpers/stripe_event_helper');
const FormatCurrency      = require('format-currency')

module.exports = {
  processCreated: function(stripe_event, bull, callback) {
    var reference_id = stripe_event.raw_object.data.object.charge;
    var source = "Stripe";
    var received_at = received_at = new Date(stripe_event.raw_object.created*1000);

  },
  processDeleted: function(stripe_event, bull, callback) {
    var reference_id = stripe_event.raw_object.data.object.charge;
    var source = "Stripe";
    var received_at = received_at = new Date(stripe_event.raw_object.created*1000);

    callback(new Error("Not Implmented"), null);
  },
  processUpdated: function(stripe_event, bull, callback) {
    var reference_id = stripe_event.raw_object.data.object.discount;
    var source = "Stripe";
    var received_at = received_at = new Date(stripe_event.raw_object.created*1000);

    callback(new Error("Not Implmented"), null);
  }
};
