const mongoose = require('mongoose');
const DiscountServices = require('../models/discount.services');

const Schema = mongoose.Schema;

const DiscountSchema = new Schema({
  membership: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Membership',
    required: true,
  },
  coupon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon',
    required: true,
  },
  subscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription',
    required: true,
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
  },
}, {
  timestamps: true,
});

DiscountSchema.statics = {
  GetDiscountById: DiscountServices.GetDiscountById,
  SaveDiscount: DiscountServices.SaveDiscount,
};

module.exports = mongoose.model('Discount', DiscountSchema);
