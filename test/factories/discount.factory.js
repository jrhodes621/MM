var factory = require('factory-girl');
var faker = require('faker');
var Discount    = require('../../models/discount');

factory.define('discount', Discount, function(buildOptions) {
  var discount = {
    membership: buildOptions.membership,
    coupon: buildOptions.coupon,
    subscription: buildOptions.subscription,
    start: faker.date.past(),
    end: faker.date.future()
  }

  return discount;
});
