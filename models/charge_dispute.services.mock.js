var ChargeDisputeFixtures = require('../fixtures/charge_dispute.fixtures')
var ChargeDispute = require('../models/charge_dispute');

var ChargeDisputeServices = {
  GetChargeDisputeByReferenceId: function(charge_dispute_id, callback) {
    callback(null, ChargeDisputeFixtures.charge_dispute);
  }
}

module.exports = ChargeDisputeServices
