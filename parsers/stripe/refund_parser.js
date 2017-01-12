var Charge      = require('../../models/charge');
var Refund      = require('../../models/refund');
var async       = require("async");

function parse(stripe_refund, callback) {
  var result = null;

  async.waterfall([
    function getCharge(callback) {
      Charge.findOne({ "reference_id": stripe_refund.charge }, function(err, charge) {
        if(!charge) { return callback(new Error("Unable to find charge"), null); }

        callback(err, charge)
      });
    },
    function getRefund(charge, callback) {
      Refund.findOne({ "reference_id": stripe_refund.id}, function(err, refund) {
        callback(err, refund, charge);
      })
    },
    function parseRefund(refund, charge, callback) {
      if(!refund) {
        refund = new Refund();
      }
      refund.charge = charge;
      refund.amount = stripe_refund.amount/100;
      refund.reference_id = stripe_refund.id;
      refund.amount = stripe_refund.amount;
      refund.currency = stripe_refund.currency;
      refund.refund_created = stripe_refund.created;
      refund.reason = stripe_refund.reason;
      refund.receipt_number = stripe_refund.receipt_number;
      refund.status = stripe_refund.status;

      refund.save(function(err) {
        result = refund;

        callback(err);
      });
    }
  ], function(err) {
    callback(err, result);
  });
}

module.exports = {
  parse
}
