var factory = require('factory-girl');
var faker = require('faker');
var ChargeDispute    = require('../../models/charge_dispute');

factory.define('charge_dispute', ChargeDispute, function(buildOptions) {
  var account = {
    reference_id: faker.random.alphaNumeric(),
    charge: buildOptions.charge,
    amount: faker.random.amount(),
    dispute_created: faker.date.recent(),
    is_charge_refundable: true,
    reason: "Fraudulent",
    status: "active"
  }

  return charge_dispute;
});
