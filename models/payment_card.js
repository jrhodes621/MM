const mongoose = require('mongoose');
const PaymentCardServices = require('../models/payment_card.services');

const Schema = mongoose.Schema;

const PaymentCardSchema = new Schema({
  reference_id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  brand: {
    type: String,
    required: true,
  },
  last4: {
    type: String,
    required: true,
  },
  exp_month: {
    type: Number,
    required: true,
  },
  exp_year: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  archive: {
    type: Boolean,
    required: true,
    default: false,
  },
}, {
  timestamps: true,
});

PaymentCardSchema.statics = {
  GetPlanById: PaymentCardServices.GetPaymentCardById,
  GetPlanByReferenceId: PaymentCardServices.GetPaymentCardByReferenceId,
  SavePaymentCard: PaymentCardServices.SavePaymentCard,
  ArchivePaymentCard: PaymentCardServices.ArchivePaymentCard,
  AddPaymentCard: PaymentCardServices.AddPaymentCard,
};

module.exports = mongoose.model('PaymentCard', PaymentCardSchema);
