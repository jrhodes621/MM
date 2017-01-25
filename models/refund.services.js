const RefundServices = {
  GetRefundById: function(refundId, callback) {
    this.findById(refundId)
    .exec(callback);
  },
  GetRefundByReferenceId: function(referenceId, callback) {
    this.findOne({ reference_id: referenceId })
    .exec(callback);
  },
  SaveRefund: (refund, callback) => {
    refund.save(callback);
  },
};

module.exports = RefundServices;
