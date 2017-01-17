var mongoose = require('mongoose');
var Schema       = mongoose.Schema;

var PaymentCardServices    = require('../models/payment_card.services')

var PaymentCardSchema   = new Schema({
  reference_id: {
    type: String,
    required: true
  },
  name: {
    type: String,
  },
  brand: {
    type: String,
    required: true
  },
  last4: {
    type: String,
    required: true
  },
  exp_month: {
    type: Number,
    required: true
  },
  exp_year: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  archive: {
    type: Boolean,
    required: true,
    default: false
  }
},
{
    timestamps: true
});

PaymentCardSchema.statics.GetPlans = PaymentCardServices.GetPaymentCardById
PaymentCardSchema.statics.GetPlans = PaymentCardServices.GetPaymentCardByReferenceId
PaymentCardSchema.statics.GetPlans = PaymentCardServices.SavePaymentCard
PaymentCardSchema.statics.GetPlans = PaymentCardServices.ArchivePaymentCard
PaymentCardSchema.statics.GetPlan = PaymentCardServices.AddPaymentCard

module.exports = mongoose.model('PaymentCard', PaymentCardSchema);
