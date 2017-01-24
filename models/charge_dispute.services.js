const ChargeDisputeServices = {
  GetChargeDisputeByReferenceId: (chargeDisputeId, callback) => {
    this.findOne({ reference_id: chargeDisputeId })
    .populate('charge')
    .exec(callback);
  },
  SaveChargeDispute: (chargeDispute, callback) => {
    chargeDispute.save(callback);
  },
};

module.exports = ChargeDisputeServices;
