var mongoose = require('mongoose');
var Schema       = mongoose.Schema;
var Membership = require('../models/membership');
var mongoosePaginate = require('mongoose-paginate');

var InvoiceSchema   = new Schema({
  membership: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Membership',
    required: true
  },
  reference_id: {
    type: String,
    required: true
  },
  amount_due: {
    type: Number,
    required: true
  },
  application_fee: {
    type: Number,
  },
  attempt_count: {
    type: Number,
    required: true,
    default: 0
  },
  attempted: {
    type: Boolean,
    required: true,
    default: false
  },
  charge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Charge'
  },
  closed: {
    type: Boolean,
    required: true,
    default: false,
  },
  currency: {
    type: String,
    required: true,
    default: 'usd'
  },
  invoice_date: {
    type: Date,
    required: true
  },
  description: {
    type: String
  },
  discount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Discount'
  },
  ending_balance: {
    type: Number,
    required: true,
    default: 0
  },
  forgiven: {
    type: Boolean,
    required: true,
    default: false
  },
  lines: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InvoiceLineItem'
  }],
  next_payment_attempt: {
    type: Date
  },
  paid: {
    type: Boolean,
    required: true,
    default: false
  },
  period_end: {
    type: Date,
    required: true
  },
  period_start: {
    type: Date,
    required: true
  },
  statement_descriptor: {
    type: String
  },
  subscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription'
  },
  subtotal: {
    type: Number,
    required: true
  },
  tax: {
    type: Number
  },
  tax_percent: {
    type: Number
  },
  total: {
    type: Number,
    required: true
  }
},
{
    timestamps: true
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
