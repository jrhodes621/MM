const mongoose = require('mongoose');
const RefundServices = require('../models/refund.services');

const Schema = mongoose.Schema;

const RefundSchema = new Schema({
  charge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Charge',
    required: true,
  },
  reference_id: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
    default: 'usd',
  },
  refund_created: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
  },
  reason: {
    type: String,
  },
  receipt_number: {
    type: String,
  },
  status: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

RefundSchema.statics = {
  GetStripeEventById: RefundServices.GetRefundById,
  GetRefundByReferenceId: RefundServices.GetRefundByReferenceId,
  SaveRefund: RefundServices.SaveRefund,
};

module.exports = mongoose.model('Refund', RefundSchema);
