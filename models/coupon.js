var mongoose   = require('mongoose');
var Schema     = mongoose.Schema;

var CouponSchema   = new Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan'
  },
  reference_id: {
    type: String,
    required: true
  },
  amount_off: {
    type: Number
  },
  coupon_created: {
    type: Date,
    required: true
  },
  currency: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  duration_in_months: {
    type: Number
  },
  max_redemptions: {
    type: Number
  },
  percent_off: {
    type: Number
  },
  redeem_by: {
    type: Date
  },
  times_redeemed: {
    type: Number,
    required: true
  },
  valid: {
    type: Boolean,
    required: true,
    default: true
  }
},
{
    timestamps: true
});

module.exports = mongoose.model('Coupon', CouponSchema);
