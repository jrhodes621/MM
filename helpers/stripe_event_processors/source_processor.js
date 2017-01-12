
module.exports = {
  processCanceled: function(stripe_event, bull, callback) {
    var reference_id = stripe_event.raw_object.data.object.charge;
    var source = "Stripe";
    var received_at = received_at = new Date(stripe_event.raw_object.created*1000);

  },
  processChargeable: function(stripe_event, bull, callback) {
    var reference_id = stripe_event.raw_object.data.object.charge;
    var source = "Stripe";
    var received_at = received_at = new Date(stripe_event.raw_object.created*1000);

    callback(new Error("Not Implmented"), null);
  },
  processFailed: function(stripe_event, bull, callback) {
    var reference_id = stripe_event.raw_object.data.object.charge;
    var source = "Stripe";
    var received_at = received_at = new Date(stripe_event.raw_object.created*1000);

    callback(new Error("Not Implmented"), null);
  }
};
