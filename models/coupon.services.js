const CouponServices = {
  GetCouponById: function(couponId, callback) {
    this.findById(couponId)
    .exec(callback);
  },
  GetCouponByReferenceId: function(referenceId, callback) {
    this.findOne({ reference_id: referenceId })
    .exec(callback);
  },
  SaveCoupon: (coupon, callback) => {
    coupon.save(callback);
  },
};

module.exports = CouponServices;
