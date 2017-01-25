const StripeEventServices = {
  GetStripeEventById: function(stripeEventId, callback) {
    this.findById(stripeEventId)
    .exec(callback);
  },
  SaveStripeEvent: (stripeEvent, callback) => {
    stripeEvent.save(callback);
  },
};

module.exports = StripeEventServices;
