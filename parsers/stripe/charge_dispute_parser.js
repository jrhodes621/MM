var async               = require('async');
var Charge              = require('../../models/charge');
var ChargeDispute       = require('../../models/charge_dispute');

function parse(stripe_charge_dispute, callback) {
  var result;

  async.waterfall([
    //get charge
    function getCharge(callback) {
      Charge.GetChargeByReferenceId(stripe_charge_dispute.charge, function(err, charge) {
        if(!charge) { return callback(new Error("Charge Not Found"), null) }

        callback(err, charge);
      });
    },
    //get charge dispute
    function getChargeDispute(charge, callback) {
      ChargeDispute.GetChargeDisputeByReferenceId(stripe_charge_dispute.id, function(err, charge_dispute) {
        callback(err, charge_dispute, charge);
      });
    },
    //parse and save
    function parse(charge_dispute, charge, callback) {
      if(!charge_dispute) {
        charge_dispute = new ChargeDispute();
      }

      charge_dispute.reference_id = stripe_charge_dispute.id;
      charge_dispute.charge = charge;
      charge_dispute.amount = stripe_charge_dispute.amount;
      charge_dispute.dispute_created = stripe_charge_dispute.created;
      charge_dispute.is_charge_refundable = stripe_charge_dispute.is_charge_refundable;
      charge_dispute.evidence = stripe_charge_dispute.evidence;
      charge_dispute.evidence_details = stripe_charge_dispute.evidence_details;
      charge_dispute.reason = stripe_charge_dispute.reason;
      charge_dispute.status = stripe_charge_dispute.status;

      charge_dispute.save((err) => {
        result = charge_dispute;

        callback(err);
      });
    }
  ], (err) => {
    callback(err, result);
  })
}
module.exports = {
  parse
}
