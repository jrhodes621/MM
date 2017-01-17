var ChargeServices = {
  GetChargesForUser: function(membership, callback) {
    this.find({'membership': membership})
    .populate('payment_card')
    .exec(callback);
  },
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
  },
  SaveCharge: function(charge, callback) {
    charge.save(function(err) {
      if(err) { console.log(err); }

      callback(err);
    });
  }
}

module.exports = ChargeServices
