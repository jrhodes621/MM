const CouponServices = {
  GetCouponById: (couponId, callback) => {
    this.findById(couponId)
    .exec(callback);
  },
  GetCouponByReferenceId: (referenceId, callback) => {
    this.findOne({ reference_id: referenceId })
    .exec(callback);
  },
  SaveCoupon: (coupon, callback) => {
    coupon.save(callback);
  },
};

module.exports = CouponServices;
