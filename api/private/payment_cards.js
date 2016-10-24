require('dotenv').config({ silent: true });

var express    = require('express');        // call express
var router = express.Router();              // get an instance of the express Router
var mongoose   = require('mongoose');
var PaymentCard = require('../../models/payment_card');
var User = require('../../models/user');
var PaymentCardHelper = require('../../helpers/payment_card_helper');

// on routes that end in /users
// ----------------------------------------------------
router.route('')
  .post(function(req, res, next) {
    var current_user = req.current_user;
    var user = req.user;

    var stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
    var stripeToken = req.body.stripe_token;

    var paymentCard = new PaymentCard();

    stripe.tokens.retrieve(stripeToken,
      function(err, token) {
        if(err) { return next(err); }

        if(!user.stripe_customer_id) {
          stripe.customers.create({
            source: stripeToken,
            description: user.email_address
          }).then(function(customer) {
            user.stripe_customer_id = customer.id;

            PaymentCardHelper.addPaymentCard(user, token.card.id, "", token.card.brand, token.card.last4, token.card.exp_month, token.card.exp_year, "Active", function(err, payment_card) {
              if(err) { return next(err); }

              user.payment_cards.push(paymentCard);
              user.save(function(err) {
                if(err) { return next(err); }

                res.status(201).json(payment_card)
              });
            });
          });
        } else {
          stripe.customers.createSource(
            user.stripe_customer_id,
            { source: stripeToken },
            function(err, card) {
              PaymentCardHelper.addPaymentCard(user, token.card.id, token.card.brand, token.card.last4, token.card.exp_month, token.card.exp_year, function(err, payment_card) {
                if(err) { return next(err); }

                user.payment_cards.push(paymentCard);
                user.save(function(err) {
                  if(err) { return next(err); }

                  res.status(201).json(payment_card)
                });
              });
            });
        }
      });
    });

module.exports = router;
