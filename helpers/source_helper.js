var PaymentCard = require('../models/payment_card');
var Step = require('step');

module.exports = {
  parse: function(user, customer, callback) {

    var numberOfSources = customer.sources.data.length;

    if(numberOfSources == 0) {
      callback(null, user);
    }
    customer.sources.data.forEach(function(source) {
      Step(
        function getPaymentCard() {
          console.log("getting payment card");

          PaymentCard.findOne({"reference_id": source.id}, this);
        },
        function parsePaymentCard(err, payment_card) {
          if(err) { throw err; }

          console.log("Parse Payment Card")

          if(!payment_card) {
            console.log("Adding Payment Card");

            payment_card = new PaymentCard();

            payment_card.reference_id = source.id;
            payment_card.name = source.name;
            payment_card.brand = source.brand;
            payment_card.last4 = source.last4;
            payment_card.exp_month = source.exp_month;
            payment_card.exp_year = source.exp_year;
            payment_card.status = "Active";

            payment_card.save(function(err) {
              if(err) { throw err; }

              console.log("Payment Card Saved");

              user.payment_cards.push(payment_card);

              numberOfSources -= 1;
              if(numberOfSources == 0) {
                callback(null, user);
              }
            });
          } else {
            numberOfSources -= 1;
            if(numberOfSources == 0) {
              callback(null, user);
            }
          }
        }
      )
    });
  },
  saveSources: function(sources, callback) {
    var numberOfSources = sources.length;

    if(numberOfSources == 0) {
      callback(null, []);
    }
    sources.forEach(function(source) {
      numberOfSources -= 1;

      source.save(function(err) {
        if(err) { console.log(err); }

        if(numberOfSources == 0) {
          callback(err, sources)
        }
      });
    });
  }
}
