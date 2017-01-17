var Coupon      = require('../../models/coupon');
var async       = require("async");

function parse(bull, stripe_coupon, callback) {
  var result = null;
  async.waterfall([
    function getCoupon(callback) {
      Coupon.findOne({"reference_id": stripe_coupon.id}, callback);
    },
    //if there is no payment_card -> add it
    function parseCoupon(coupon, callback) {
      if(!coupon) {
        coupon = new Coupon();
      }
      coupon.account = bull;
      coupon.reference_id = stripe_coupon.id;
      coupon.amount_off = stripe_coupon.amount_off;
      coupon.coupon_created = stripe_coupon.created;
      coupon.currency = stripe_coupon.currency || 'usd';
      coupon.duration = stripe_coupon.duration;
      coupon.duration_in_months = stripe_coupon.duration_in_months;
      coupon.max_redemptions = stripe_coupon.max_redemptions;
      coupon.percent_off = stripe_coupon.percent_off;
      coupon.redeem_by = stripe_coupon.redeem_by;
      coupon.times_redeemed = stripe_coupon.times_redeemed;
      coupon.valid = stripe_coupon.valid;

      coupon.save(function(err) {
        result = coupon;

        callback(err);
      });
    }
  ], function(err) {
    callback(err, result);
  });
}

module.exports = {
  parse
}
