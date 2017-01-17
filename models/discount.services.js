var DiscountServices = {
  GetDiscountById: function(discount, callback) {
    this.findById(coupon_id)
    .exec(callback);
  },
  SaveDiscount: function(discount, callback) {
    discount.save(function(err) {
      if(err) { console.log(err); }

      callback(err);
    });
  },
}

module.exports = DiscountServices
