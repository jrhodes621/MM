var Coupon        = require('../../models/coupon');
var Discount      = require('../../models/discount');
var Membership    = require('../../models/membership');
var Subscription  = require('../../models/subscription');

var async         = require('async');

function parse(bull, stripe_discount, callback) {
  var discount_result = null;
  var coupon_result = null;
  async.waterfall([
    function getCoupon(callback) {
      Coupon.findOne({"reference_id": stripe_discount.coupon.id}, callback);
    },
    //if there is no payment_card -> add it
    function parseCoupon(coupon, callback) {
      if(!coupon) {
        coupon = new Coupon();
      }
      coupon.account = bull;
      coupon.reference_id = stripe_discount.coupon.id;
      coupon.amount_off = stripe_discount.coupon.amount_off;
      coupon.coupon_created = stripe_discount.coupon.created;
      coupon.currency = stripe_discount.coupon.currency;
      coupon.duration = stripe_discount.coupon.duration;
      coupon.duration_in_months = stripe_discount.coupon.duration_in_months;
      coupon.max_redemptions = stripe_discount.coupon.max_redemptions;
      coupon.percent_off = stripe_discount.coupon.percent_off;
      coupon.redeem_by = stripe_discount.coupon.redeem_by;
      coupon.times_redeemed = stripe_discount.coupon.times_redeemed;
      coupon.valid = stripe_discount.coupon.valid;

      coupon.save((err) => {
        callback(err, coupon);
      });
    },
    function getSubscription(coupon, callback) {
      Subscription.findOne({ "reference_id": stripe_discount.subscription })
      .populate('membership')
      .exec(function(err, subscription) {
        callback(err, subscription, coupon);
      });
    },
    function getDiscount(subscription, coupon, callback) {
      Discount.findOne({ "reference_id": stripe_discount.id }, function(err, discount) {
        callback(err, discount, subscription, coupon);
      });
    },
    function parseDiscount(discount, subscription, coupon, callback) {
      if(!discount) {
        discount = new Discount()
      }
      discount.membership = subscription.membership;
      discount.coupon = coupon;
      discount.subscription = subscription;
      discount.start = stripe_discount.start;
      discount.end = stripe_discount.end;

      discount.save((err) => {
        discount_result = discount;
        coupon_result = coupon;

        callback(err);
      })
    }
  ], (err) => {
    callback(err, discount_result, coupon_result);
  });
}

module.exports = {
  parse
}
