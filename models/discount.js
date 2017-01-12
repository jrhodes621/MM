var mongoose   = require('mongoose');
var Schema     = mongoose.Schema;
var Membership    = require('../models/membership');
var Coupon    = require('../models/coupon');
var Subscription    = require('../models/subscription');

var DiscountSchema   = new Schema({
  membership: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Membership',
    required: true
  },
  coupon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon',
    required: true
  },
  subscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription',
    required: true
  },
  start: {
    type:  Date,
    required: true
  },
  end: {
    type: Date
  }
},
{
    timestamps: true
});

module.exports = mongoose.model('Discount', DiscountSchema);
