var PaymentCard      = require('../../models/payment_card');
var Membership       = require('../../models/membership');
var async            = require('async');

function parse(stripe_card, callback) {
  var result = null;

  async.waterfall([
    function getMembership(callback) {
      Membership.findOne({ "reference_id": stripe_card.customer })
      .populate('user')
      .exec(function(err, membership) {
        if(!membership) { callback(new Error("Membership not found"), null); }

        callback(err, membership.user);
      })
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

      payment_card.save((err) => {
        if(err) { callback(err, user, payment_card); }

        result = payment_card;

        if(user.payment_cards.indexOf(payment_card._id) === -1) {
          user.payment_cards.push(payment_card);

          user.save((err) => {
            callback(err)
          })
        } else {
          callback(err);
        }
      });
    }
  ], (err) => {
    callback(err, result);
  });
}

module.exports = {
  parse
}
