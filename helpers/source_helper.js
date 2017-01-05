var PaymentCard = require('../models/payment_card');
var Step = require('step');
var async = require("async");

module.exports = {
  parse: function(user, customer, callback) {
    var all_sources = [];

    async.eachSeries(customer.sources.data, function(source, callback) {
      async.waterfall([
        function getPaymentCard(callback) {
          PaymentCard.findOne({ "reference_id": source.id }, callback);
        },
        function parsePaymentCard(payment_card, callback) {
          if(!payment_card) {
            payment_card = new PaymentCard();

            payment_card.reference_id = source.id;
            payment_card.name = source.name;
            payment_card.brand = source.brand;
            payment_card.last4 = source.last4;
            payment_card.exp_month = source.exp_month;
            payment_card.exp_year = source.exp_year;
            payment_card.status = "Active";

            payment_card.save(function(err) {
              user.payment_cards.push(payment_card);

              callback(err, payment_card);
            });
          } else {
            callback(null, payment_card);
          }
        }
      ], function(err, payment_cards) {
        all_sources.push(payment_cards);

        user.save(function(err) {
          callback(err, payment_cards);
        });
      });
    }, function(err) {
      callback(err, all_sources);
    });
  }
}
