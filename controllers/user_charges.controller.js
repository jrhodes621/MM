var Charge = require('../models/charge');
var Membership = require('../models/membership');
var User = require('../models/user');
var StripeServices = require('../services/stripe.services');

var UserChargesController = {
  GetCharges: function(req, res, next) {
    var current_user = req.current_user;
    var user = req.user;

    Membership.findOne( { "user": user, "account": current_user.account }, function(err, membership) {
      if(err) { return next(err); }
      if(!membership) { return next(new Error("No membership for user")) }

      Charge.GetChargesForUser(membership, function(err, charges) {
        if(err) { return next(err); }

        res.status(200).send(charges);
      });
    });
  },
  CreateCharge: function(req, res, next) {
    var current_user = req.current_user;
    var user = req.user;
    var amount = req.body.amount;
    var currency = "usd";
    var customer_id = user.memberships[0].reference_id;
    var description = req.body.description;

    var stripe_api_key = current_user.account.stripe_connect.access_token;

    //verify user has a reference_id
    StripeServices.createCharge(stripe_api_key, customer_id, amount, currency, description, function(err, stripe_charge) {
      if(err) { return next(err); }
      if(!stripe_charge) { return next(new Error("Unable able to create Stripe Charge")); }

      var charge = new Charge();
      charge.reference_id = stripe_charge.id;
      charge.amount = stripe_charge.amount/100;
      charge.amount_refunded = stripe_charge.amount_refunded;
      charge.balance_transaction = stripe_charge.balance_transaction;
      charge.captured = stripe_charge.captured;
      charge.charge_created = new Date(stripe_charge.created * 1000);
      charge.currency = stripe_charge.currency;
      charge.description = stripe_charge.description;
      charge.destination = stripe_charge.destination;
      charge.dispute = stripe_charge.dispute;
      charge.failure_code = stripe_charge.failure_code;
      charge.failure_message = stripe_charge.failure_message;
      charge.invoice = stripe_charge.invoice;
      charge.paid = stripe_charge.paid;
      charge.receipt_email = stripe_charge.receipt_email;
      charge.receipt_number = stripe_charge.receipt_number;
      charge.refunded = stripe_charge.refunded;
      charge.shipping = stripe_charge.shipping;
      charge.source_transfer = stripe_charge.source_transfer;
      charge.statement_descriptor = stripe_charge.statement_descriptor;
      charge.status = stripe_charge.status;
      charge.card_info = stripe_charge.source.brand + " ending in " + stripe_charge.source.last4;

      Charge.SaveCharge(function(err) {
        if(err) { return next(err) }

        user.charges.push(charge);
        User.SaveUser(function(err) {
          if(err) { return next(err) }

          res.status(201).send(charge);
        });
      });
    });
  }
}

module.exports = UserChargesController
