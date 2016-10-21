var mongoose = require('mongoose');
var Schema       = mongoose.Schema;

var ChargeSchema   = new Schema({
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
  }
});

module.exports = mongoose.model('Charge', ChargeSchema);
