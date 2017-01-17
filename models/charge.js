var mongoose         = require('mongoose');
var Schema           = mongoose.Schema;
var Membership       = require('../models/membership');

var ChargeServices   = require('../models/charge.services')

var ChargeSchema   = new Schema({
  membership: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Membership',
    required: true
  },
  payment_card: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PaymentCard',
    required: true
  },
  reference_id: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  amount_refunded: {
    type: Number,
    required: true
  },
  balance_transaction: {
    type: String
  },
  captured: {
    type: Boolean,
    required: true
  },
  charge_created: {
    type: Date,
    required: true
  },
  currency: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  destination: {
    type: String
  },
  dispute: {
    type: String
  },
  failure_code: {
    type: String
  },
  failure_message: {
    type: String
  },
  invoice: {
    type: String
  },
  paid: {
    type: Boolean
  },
  receipt_email: {
    type: String
  },
  receipt_number: {
    type: String
  },
  refunded: {
    type: Boolean
  },
  shipping: {
    type: String
  },
  source_transfer: {
    type: String
  },
  statement_descriptor: {
    type: String
  },
  status: {
    type: String,
    required: true
  },
  card_info: {
    type: String,
    required: true,
    default: 'unknown card'
  }
},
{
    timestamps: true
});

ChargeSchema.statics.GetChargesForUser = ChargeServices.GetChargesForUser
ChargeSchema.statics.GetChargeById = ChargeServices.GetChargeById
ChargeSchema.statics.GetChargeByReferenceId = ChargeServices.GetChargeByReferenceId
ChargeSchema.statics.SaveCharge = ChargeServices.SaveCharge

module.exports = mongoose.model('Charge', ChargeSchema);
