const ChargeServices = {
  GetChargesForUser: (userMembership, callback) => {
    this.find({ membership: userMembership })
    .populate('payment_card')
    .exec(callback);
  },
  GetChargeById: (chargeId, callback) => {
    this.findById(chargeId)
    .populate('membership')
    .populate('payment_card')
    .exec(callback);
  },
  GetChargeByReferenceId: (referenceId, callback) => {
    this.findOne({ reference_id: referenceId })
    .populate('membership')
    .populate('payment_card')
    .exec(callback);
  },
  SaveCharge: (charge, callback) => {
    charge.save(callback);
  },
};

module.exports = ChargeServices;
