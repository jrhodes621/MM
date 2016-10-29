var request = require('request');
var Charge = require('../models/charge')
var PaymentCard = require('../models/payment_card');
var Plan = require('../models/plan');
var Subscription = require('../models/subscription');
var StripeManager = require('./stripe_manager');
var SubscriptionHelper = require('./subscription_helper')
var User = require('../models/user');
var Step = require('step');

module.exports = {
  importFromStripe: function(user, callback) {
    var stripe_api_key = user.account.stripe_connect.access_token;

    Step(
      function getStripePlans() {
        StripeManager.listPlans(stripe_api_key, this)
      },
      function parsePlans(err, stripePlans) {
        console.log(stripePlans);

        var plans = [];
        stripePlans.data.forEach(function(stripePlan) {
          var plan = new Plan();
          plan.user = user._id;
          plan.name = stripePlan.name;
          plan.reference_id = stripePlan.id;
          plan.amount = stripePlan.amount;
          plan.created = stripePlan.created;
          plan.currency = stripePlan.currency;
          plan.interval = stripePlan.interval;
          plan.interval_count = stripePlan.interval_count;
          plan.statement_descriptor = stripePlan.statement_descriptor;
          plan.trial_period_days = 0 //stripePlan.trial_period_days;

          plans.push(plan);
        });

        callback(err, plans);
      }
    );
  },
  importMembersFromPlan: function(user, plan, callback) {
    var stripe_api_key = user.account.stripe_connect.access_token;

    Step(
      function getSubscriptionsFromStripe() {
        StripeManager.listSubscriptions(stripe_api_key, plan.reference_id, this);
      },
      function parseSubscriptions(err, stripe_subscriptions) {
        if(err) { throw err; }

        SubscriptionHelper.parse(stripe_api_key, stripe_subscriptions.data, plan, this);
      },
      function returnMembers(err, memberUsers) {
        callback(err, memberUsers);
      }
    );
  },
  importChargesForCustomers: function(user, callback) {
    var stripe_api_key = user.account.stripe_connect.access_token;
    var user_charges = [];

    StripeManager.listCharges(stripe_api_key, user.reference_id, function(err, charges) {
      charges.data.forEach(function(stripe_charge) {
        var charge = new Charge();

        charge.reference_id = stripe_charge.id;
        charge.amount = stripe_charge.amount;
        charge.amount_refunded = stripe_charge.amount_refunded;
        charge.balance_transaction = stripe_charge.balance_transaction;
        charge.captured = stripe_charge.captured;
        charge.charged_created = stripe_charge.created;
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

        user_charges.push(charge)

        if(user_charges.length == charges.length) {
          callback(user_charges);
        }
      });
    });
  }
}
