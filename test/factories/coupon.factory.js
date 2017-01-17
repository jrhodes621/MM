var factory = require('factory-girl');
var faker = require('faker');
var Coupon    = require('../../models/coupon');

factory.define('coupon', CouponFactory, function(buildOptions) {
  var coupon = {
    account: buildOptions.account,
    charge: buildOptions.plan,
    reference_id: faker.random.alphaNumeric(),
    coupon_created: faker.date.recent(),
    amount_off: faker.finance.amount(),
    currency: "usd",
    duration: "1 Month",
    duration_in_months: 1,
    max_redemptions: faker.random.number(),
    percent_off: faker.random.number(),
    redeem_by: faker.date.future(),
    times_redeemed: faker.random.number(),
    valid: true
  }

  return coupon;
});
