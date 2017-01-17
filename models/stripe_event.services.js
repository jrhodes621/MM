var StripeEventServices = {
  GetStripeEventById: function(refund_id, callback) {
    this.findById(refund_id)
    .exec(callback);
  },
  SaveStripeEvent: function(stripe_event, callback) {
    stripe_event.save(function(err) {
      if(err) { console.log(err); }

      callback(err);
    });
  },
}

module.exports = StripeEventServices
