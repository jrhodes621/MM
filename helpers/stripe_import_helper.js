var request = require('request');
var Charge = require('../models/charge')
var PaymentCard = require('../models/payment_card');
var Plan = require('../models/plan');
var Subscription = require('../models/subscription');
var StripeManager = require('./stripe_manager');
var User = require('../models/user');

module.exports = {
  importFromStripe: function(user, callback) {
    stripe_api_key = user.account.stripe_connect.access_token;

    StripeManager.listPlans(stripe_api_key, function(err, stripePlans) {
      var errors = [];
      var plans = [];

      if(err) {
        errors.push(err);

        callback(errors, null);
      }

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

        plans.push(plan)
      });

      callback(errors, plans);
    })
  },
  importMembersFromPlan: function(user, plan, callback) {
    var stripe_api_key = user.account.stripe_connect.access_token;

    StripeManager.listSubscriptions(stripe_api_key, plan.reference_id, function(err, subscriptions) {
      console.log(subscriptions);

      var errors = [];
      var members = [];

      var subscriptionsCount = subscriptions.data.length;

      if(subscriptionsCount == 0) {
        callback(errors, members);
      }
      subscriptions.data.forEach(function(stripe_subscription) {
        StripeManager.getMember(stripe_api_key, stripe_subscription.customer, function(err, customer) {
          subscriptionsCount = subscriptionsCount - 1;

          if(err) {
            console.log(err);
          } else {
            var subscription = new Subscription();
            subscription.plan = plan;
            subscription.reference_id = stripe_subscription.id;
            subscription.subscription_created_at = stripe_subscription.created_at;
            subscription.subscription_canceled_at = stripe_subscription.canceled_at;
            subscription.trial_start = stripe_subscription.trial_start;
            subscription.trial_end = stripe_subscription.trial_end;
            subscription.status = stripe_subscription.status;

            var memberUser = new User();
            memberUser.email_address = customer.email;
            memberUser.password = "test123";
            memberUser.memberships.push({
              reference_id: customer.id,
              company_name: user.account.company_name,
              account_id: user.account._id,
              plan_names: [plan.name],
              member_since: customer.created,
              subscription: subscription
            })
            memberUser.status = "Active";

            var numberOfPaymentCards = customer.sources.data.length;

            if(numberOfPaymentCards > 0) {
              customer.sources.data.forEach(function(source) {
                var paymentCard = new PaymentCard();

                paymentCard.reference_id = source.id;
                paymentCard.name = source.name;
                paymentCard.brand = source.brand;
                paymentCard.last4 = source.last4;
                paymentCard.exp_month = source.exp_month;
                paymentCard.exp_year = source.exp_year;

                paymentCard.save(function(err) {
                  numberOfPaymentCards -= 1;

                  if(err) {
                    console.log(err);
                  } else {
                    memberUser.payment_cards.push(paymentCard);
                  }
                  if(numberOfPaymentCards == 0) {
                    members.push(memberUser);

                    if(subscriptionsCount == 0) {
                      callback(errors, members);
                    }
                  }
                });
              });
            } else {
              members.push(memberUser);

              if(subscriptionsCount == 0) {
                callback(errors, members);
              }
            }
          }
        });
      });
    });
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
