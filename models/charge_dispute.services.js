var ChargeDispute = require('../models/charge_dispute');

var ChargeDisputeServices = {
  GetChargeDisputeByReferenceId: function(charge_dispute_id, callback) {
    this.findOne({ "reference_id": charge_dispute_id })
    .populate('charge')
    .exec(function(err, charge_dispute) {
      callback(err, charge_dispute);
    });
  },
  SaveChargeDispute: function(plan, callback) {
    this.save(function(err) {
      if(err) { console.log(err); }

      callback(err);
    });
  },
}

module.exports = ChargeDisputeServices
