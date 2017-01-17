var CouponServices = {
  GetCouponById: function(coupon_id, callback) {
    this.findById(coupon_id)
    .exec(callback);
  },
  GetCouponByReferenceId: function(reference_id, callback) {
    this.findOne({ "reference_id": reference_id })
    .exec(callback);
  },
  SaveCoupon: function(coupon, callback) {
    coupon.save(function(err) {
      if(err) { console.log(err); }

      callback(err);
    });
  },
}

module.exports = CouponServices
