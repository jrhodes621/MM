const DiscountServices = {
  GetDiscountById: (discountId, callback) => {
    this.findById(discountId)
    .exec(callback);
  },
  SaveDiscount: (discount, callback) => {
    discount.save(callback);
  },
};

module.exports = DiscountServices;
