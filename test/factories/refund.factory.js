var factory = require('factory-girl');
var faker = require('faker');
var Refund    = require('../../models/refund');

factory.define('refund', Refund, function(buildOptions) {
  var refund = {
    charge: buildOptions.charge,
    reference_id: faker.random.alphaNumeric(),
    amount: faker.finance.amount(),
    currency: "usd",
    refund_created: faker.date.recent(),
    description: "Test Refund",
    reason: "Test Reason",
    receipt_number: faker.random.alphaNumeric(),
    status: "active"
  }

  return refund;
});
