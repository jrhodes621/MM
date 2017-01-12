var mongoose                = require('mongoose');
var Schema                  = mongoose.Schema;
var Charge                  = require('../models/charge');
var ChargeDisputeServices   = require('../models/charge_dispute.services')

var ChargeDisputeSchema   = new Schema({
  reference_id: {
    type: String,
    required: true
  },
  charge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Charge',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  dispute_created: {
    type: Date,
    required: true
  },
  is_charge_refundable: {
    type: Boolean,
    required: true,
    default: true
  },
  evidence: mongoose.Schema.Types.Mixed,
  evidence_details: mongoose.Schema.Types.Mixed,
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  }
},
{
    timestamps: true
});

ChargeDisputeSchema.statics.GetChargeDisputeByReferenceId = ChargeDisputeServices.GetChargeDisputeByReferenceId

module.exports = mongoose.model('ChargeDispute', ChargeDisputeSchema);
