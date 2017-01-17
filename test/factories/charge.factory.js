var factory     = require('factory-girl');
var faker       = require('faker');
var Charge      = require('../../models/charge');

factory.define('charge', Charge, function(buildOptions) {
  var charge = {
    membership: buildOptions.membership,
    payment_card: buildOptions.payment_card,
    reference_id: faker.random.alphaNumeric(),
    amount: faker.finance.amount(),
    amount_refunded: 0,
    captured: true,
    charge_created: new Date(),
    currency: 'usd',
    status: 'active'
  }

  return charge;
});
