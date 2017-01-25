const Charge = require('../models/charge');
const Membership = require('../models/membership');
const User = require('../models/user');
const StripeServices = require('../services/stripe.services');

const UserChargesController = {
  GetCharges: (req, res, next) => {
    const currentUser = req.currentUser;
    const user = req.user;

    Membership.findOne({ user, account: currentUser.account }, (err, membership) => {
      if (err) { return next(err); }
      if (!membership) { return next(new Error('No membership for user')); }

      Charge.GetChargesForUser(membership, (err, charges) => {
        if (err) { return next(err); }

        return res.status(200).send(charges);
      });
    });
  },
  CreateCharge: function(req, res, next) {
    const currentUser = req.currentUser;
    const user = req.user;
    const amount = req.body.amount;
    const currency = "usd";
    const customerId = user.memberships[0].reference_id;
    const description = req.body.description;

    const stripeApiKey = currentUser.account.stripe_connect.access_token;

    StripeServices.createCharge(stripeApiKey, customerId, amount, currency, description,
    (err, stripeCharge) => {
      if (err) { return next(err); }
      if (!stripeCharge) { return next(new Error('Unable able to create Stripe Charge')); }

      const charge = new Charge();

      charge.reference_id = stripeCharge.id;
      charge.amount = stripeCharge.amount / 100;
      charge.amount_refunded = stripeCharge.amount_refunded;
      charge.balance_transaction = stripeCharge.balance_transaction;
      charge.captured = stripeCharge.captured;
      charge.charge_created = new Date(stripeCharge.created * 1000);
      charge.currency = stripeCharge.currency;
      charge.description = stripeCharge.description;
      charge.destination = stripeCharge.destination;
      charge.dispute = stripeCharge.dispute;
      charge.failure_code = stripeCharge.failure_code;
      charge.failure_message = stripeCharge.failure_message;
      charge.invoice = stripeCharge.invoice;
      charge.paid = stripeCharge.paid;
      charge.receipt_email = stripeCharge.receipt_email;
      charge.receipt_number = stripeCharge.receipt_number;
      charge.refunded = stripeCharge.refunded;
      charge.shipping = stripeCharge.shipping;
      charge.source_transfer = stripeCharge.source_transfer;
      charge.statement_descriptor = stripeCharge.statement_descriptor;
      charge.status = stripeCharge.status;
      charge.card_info = stripeCharge.source.brand + ' ending in ' + stripeCharge.source.last4;

      Charge.SaveCharge((err) => {
        if (err) { return next(err); }

        user.charges.push(charge);
        User.SaveUser((err) => {
          if (err) { return next(err); }

          return res.status(201).send(charge);
        });
      });
    });
  },
};

module.exports = UserChargesController;
