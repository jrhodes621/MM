var factory     = require('factory-girl');
var faker       = require('faker');
var PaymentCard = require('../../models/payment_card');

factory.define('payment_card', PaymentCard, function(buildOptions) {
  var payment_card = {
    reference_id: faker.random.alphaNumeric(),
    name: faker.name.findName(),
    brand: "Visa",
    last4: "1111",
    exp_month: 4,
    exp_year: 2020,
    status: "active",
    archive: false
  }

  return payment_card;
});
