var PaymentCard      = require('../../models/payment_card');
var User             = require('../../models/user');
var async            = require("async");

function parse(stripe_card, callback) {
  var result = null;

  async.waterfall([
    function getUser(callback) {
      User.findOne({ "reference_id": stripe_card.customer }, callback)
    },
    function getPaymentCard(user, callback) {
      PaymentCard.findOne({"reference_id": stripe_card.id}, function(err, payment_card) {
        callback(err, user, payment_card);
      });
    },
    function parse(user, payment_card, callback) {
      if(!payment_card) {
        payment_card = new PaymentCard();
      }
      payment_card.reference_id = stripe_card.id;
      payment_card.name = stripe_card.name;
      payment_card.brand = stripe_card.brand;
      payment_card.last4 = stripe_card.last4;
      payment_card.exp_month = stripe_card.exp_month;
      payment_card.exp_year = stripe_card.exp_year;
      payment_card.status = "Active";

      payment_card.save(function(err) {
        if(err) { callback(err, user, payment_card); }

        result = payment_card;

        if(user.payment_cards.indexOf(payment_card._id) === -1) {
          user.payment_cards.push(payment_card);

          user.save(function(err) {
            callback(err)
          })
        } else {
          callback(err);
        }
      });
    }
  ], function(err) {
    callback(err, result);
  });
}

module.exports = {
  parse
}
