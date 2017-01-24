const RefundServices = {
  GetRefundById: (refundId, callback) => {
    this.findById(refundId)
    .exec(callback);
  },
  GetRefundByReferenceId: (referenceId, callback) => {
    this.findOne({ reference_id: referenceId })
    .exec(callback);
  },
  SaveRefund: (refund, callback) => {
    refund.save(callback);
  },
};

module.exports = RefundServices;
