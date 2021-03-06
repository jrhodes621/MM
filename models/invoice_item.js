const mongoose = require('mongoose');
const InvoiceItemServices = require('../models/invoice_item.services');

const Schema = mongoose.Schema;

const InvoiceItemSchema = new Schema({
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
    default: 'usd',
  },
  description: {
    type: String,
  },
  discountable: {
    type: Boolean,
    required: true,
    default: false,
  },
  period_start: {
    type: Date,
  },
  period_end: {
    type: Date,
  },
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan',
  },
  proration: {
    type: Boolean,
    required: true,
    default: false,
  },
  quantity: {
    type: Number,
  },
  subscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription',
  },
  invoice_line_item_type: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

InvoiceItemSchema.statics = {
  GetInvoiceItemById: InvoiceItemServices.GetInvoiceItemById,
  SaveInvoiceItem: InvoiceItemServices.SaveInvoiceItem,
};

module.exports = mongoose.model('InvoiceItem', InvoiceItemSchema);
