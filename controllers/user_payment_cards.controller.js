var User = require('../models/user');
var Membership = require('../models/membership');
var PaymentCard = require('../models/payment_card');

var UserPaymentCardsController = {
  CreatePaymentCard: function(req, res, next) {
    var current_user = req.current_user;
    var user = req.user;

    var stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
    var stripeToken = req.body.stripe_token;

    var paymentCard = new PaymentCard();

    stripe.tokens.retrieve(stripeToken,
      function(err, token) {
        if(err) { return next(err); }

        Membership.findOne({ "user": user, "account": current_user.account }, function(membership) {
          if(!membership) { return next(new Error("Can't find membership")) }

          if(!membership.reference_id) {
            stripe.customers.create({
              source: stripeToken,
              description: user.email_address
            }).then(function(customer) {
              membership.reference_id = customer.id;

              PaymentCard.AddPaymentCard(user, token.card.id, "", token.card.brand, token.card.last4, token.card.exp_month, token.card.exp_year, "Active", function(err, payment_card) {
                if(err) { return next(err); }

                user.payment_cards.push(payment_card);
                user.save(function(err) {
                  if(err) { return next(err); }

                  res.status(201).json(payment_card)
                });
              });
            });
          } else {
            stripe.customers.createSource(
              membership.reference_id,
              { source: stripeToken },
              function(err, card) {
                PaymentCard.AddPaymentCard(user, token.card.id, "", token.card.brand, token.card.last4, token.card.exp_month, token.card.exp_year, "Active", function(err, payment_card) {
                  if(err) { return next(err); }

                  user.payment_cards.push(payment_card);
                  user.save(function(err) {
                    if(err) { return next(err); }

                    res.status(201).json(payment_card)
                  });
                });
              });
          }
        });
    });
  }
}

module.exports = UserPaymentCardsController
