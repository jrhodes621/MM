var RefundServices = {
  GetRefundById: function(refund_id, callback) {
    this.findById(refund_id)
    .exec(callback);
  },
  GetRefundByReferenceId: function(reference_id, callback) {
    this.findOne({ "reference_id": reference_id })
    .exec(callback);
  },
  SaveRefund: function(refund, callback) {
    refund.save(function(err) {
      if(err) { console.log(err); }

      callback(err);
    });
  },
}

module.exports = RefundServices
