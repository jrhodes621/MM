const mongoose = require('mongoose');
const ChargeDisputeServices = require('../models/charge_dispute.services');

const Schema = mongoose.Schema;

const ChargeDisputeSchema = new Schema({
  reference_id: {
    type: String,
    required: true,
  },
  charge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Charge',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  dispute_created: {
    type: Date,
    required: true,
  },
  is_charge_refundable: {
    type: Boolean,
    required: true,
    default: true,
  },
  evidence: mongoose.Schema.Types.Mixed,
  evidence_details: mongoose.Schema.Types.Mixed,
  reason: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

ChargeDisputeSchema.statics = {
  GetChargeDisputeByReferenceId: ChargeDisputeServices.GetChargeDisputeByReferenceId,
  SaveChargeDispute: ChargeDisputeServices.SaveChargeDispute,
};

module.exports = mongoose.model('ChargeDispute', ChargeDisputeSchema);
