var ChargeServices = {
  GetChargeById: function(charge_id, callback) {
    this.findById(charge_id)
    .populate('membership')
    .populate('payment_card')
    .exec(callback);
  },
  GetChargeByReferenceId: function(reference_id, callback) {
    this.findOne({ "reference_id": reference_id })
    .populate('membership')
    .populate('payment_card')
    .exec(callback);
  }
}

module.exports = ChargeServices
