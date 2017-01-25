const Membership = require('../models/membership');
const PaymentCard = require('../models/payment_card');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const UserPaymentCardsController = {
  CreatePaymentCard: (req, res, next) => {
    const currentUser = req.currentUser;
    const user = req.user;
    const stripeToken = req.body.stripe_token;

    stripe.tokens.retrieve(stripeToken,
      (err, token) => {
        if (err) { return next(err); }

        Membership.findOne({ user, account: currentUser.account }, (membership) => {
          if (!membership) { return next(new Error("Can't find membership")); }

          if (!membership.reference_id) {
            stripe.customers.create({
              source: stripeToken,
              description: user.email_address,
            }).then((customer) => {
              membership.reference_id = customer.id;

              PaymentCard.AddPaymentCard(user, token.card.id, '', token.card.brand, token.card.last4, token.card.exp_month, token.card.exp_year,
              'Active', (err, paymentCard) => {
                if (err) { return next(err); }

                user.payment_cards.push(paymentCard);
                user.save((err) => {
                  if (err) { return next(err); }

                  res.status(201).json(paymentCard);
                });
              });
            });
          } else {
            stripe.customers.createSource(
              membership.reference_id,
              { source: stripeToken },
              (err, card) => {
                PaymentCard.AddPaymentCard(user, token.card.id, '', token.card.brand, token.card.last4, token.card.exp_month, token.card.exp_year,
                'Active', (err, paymentCard) => {
                  if (err) { return next(err); }

                  user.payment_cards.push(paymentCard);
                  user.save((err) => {
                    if (err) { return next(err); }

                    return res.status(201).json(paymentCard)
                  });
                });
              });
          }
        });
      });
  },
};


module.exports = UserPaymentCardsController
