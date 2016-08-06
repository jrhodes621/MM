var request = require('request');

module.exports = {
  subscribeCustomerToPlan: function(stripe_api_key, customer_id, plan_id, callback) {
    var stripe = require('stripe')(stripe_api_key);

    stripe.subscriptions.create({
      customer: customer_id,
      plan: plan_id
    }, function(err, subscription) {
        callback(err, subscription);
      }
    );
  },
  createSubscription: function(stripe_api_key, token, plan_id, email, callback) {
    var stripe = require('stripe')(stripe_api_key);

    stripe.customers.create({
      source: token, // obtained with Stripe.js
      plan: plan_id,
      email: email
    }, function(err, customer) {
      callback(err, customer);
    });
  },
  cancelSubscription: function(stripe_api_key, subscription_id, callback) {
    var stripe = require('stripe')(stripe_api_key);

    stripe.subscriptions.del(
      subscription_id,
      function(err, confirmation) {
        callback(err, confirmation);
      }
    );
  },
  listPlans: function(stripe_api_key, callback) {
    var stripe = require('stripe')(stripe_api_key);

    stripe.plans.list(
      {},
      function(err, plans) {
        callback(err, plans);
      }
    );
  },
  getPlan: function(stripe_api_key, plan_id, callback) {
    var stripe = require('stripe')(stripe_api_key);

    stripe.plans.retrieve(
      plan_id,
      function(err, plan) {
        callback(err, plan);
      }
    );
  },
  createPlan: function(stripe_api_key, plan, callback) {
    var stripe = require('stripe')(stripe_api_key);

    stripe.plans.create({
      amount: plan.amount*100,
      interval: plan.interval,
      name: plan.name,
      currency: "usd",
      id: plan.name,
      trial_period_days: plan.trial_period_days | 0,
      metadata: {
        'description': plan.description,
        'termsofservice': plan.terms_of_service,
      }
    }, function(err, plan) {
      callback(err, plan);
    });
  },
  updatePlan: function(stripe_api_key, plan, callback) {
    var stripe = require('stripe')(stripe_api_key);

    stripe.plans.update(plan.id, {
      name: plan.name,
      metadata: {
        'description': plan.description,
        'termsofservice': plan.terms_of_service,
      }
    }, function(err, plan) {
      callback(err, plan);
    });
  },
  listMembers: function(stripe_api_key, callback) {
    var stripe = require('stripe')(stripe_api_key);

    stripe.customers.list(
      { limit: 12},
      function(err, plans) {
        callback(err, plans);
      }
    );
  },
  getMember: function(stripe_api_key, customer_id, callback) {
    var stripe = require('stripe')(stripe_api_key);

    stripe.customers.retrieve(
      customer_id,
      function(err, customer) {
        callback(err, customer);
      }
    );
  },
  listCharges: function(stripe_api_key, customer_id, callback) {
    var stripe = require('stripe')(stripe_api_key);

    stripe.charges.list({
      limit: 20,
      customer: customer_id
    }, function(err, charges) {
        callback(err, charges);
      }
    );
  },
  createCoupon: function(stripe_api_key, coupon, callback) {
    var stripe = require('stripe')(stripe_api_key);

    stripe.coupons.create({
        percent_off: coupon.percent_off,
        amount_off: coupon.amount_off,
        currency: 'usd',
        duration: coupon.duration,
        duration_in_months: coupon.duration_in_months,
        max_redemptions: coupon.max_redemptions,
        id: coupon.id
      }, function(err, coupon) {
        callback(err, coupon);
      }
    );
  },
  listCoupons: function(stripe_api_key, callback) {
    var stripe = require('stripe')(stripe_api_key);

    stripe.coupons.list(
      { limit: 12 },
      function(err, coupons) {
        callback(err, coupons);
      }
    );
  },
  getInvoice: function(stripe_api_key, invoice_id, callback) {
    var stripe = require('stripe')(stripe_api_key);

    stripe.invoices.retrieve(
      invoice_id,
      function(err, invoice) {
        callback(err, invoice);
      }
    );
  },
  listCards: function(stripe_api_key, customer_id, callback) {
    var stripe = require('stripe')(stripe_api_key);

    stripe.customers.listCards(customer_id, function(err, cards) {
      callback(err, cards);
    });
  },
  createCard: function(stripe_api_key, customer_id, token, callback) {
    var stripe = require('stripe')(stripe_api_key);

    stripe.customers.createSource(
      customer_id,
      {source: token},
      function(err, card) {
        callback(err, card);
      }
    );
  },
  getCard: function(stripe_api_key, customer_id, card_id, callback) {
    var stripe = require('stripe')(stripe_api_key);

    stripe.customers.retrieveCard(
      customer_id,
      card_id,
      function(err, card) {
        callback(err, card);
      }
    );
  },
  updateCard: function(stripe_api_key, customer_id, card_id, card,callback) {
    stripe.customers.updateCard(
      customer_id,
      card_id,
      {
        name: card.name,
        exp_month: card.exp_month,
        exp_year: card.exp_year
      },
      function(err, card) {
        callback(err, card);
      }
    );
  },
  deleteCard: function(stripe_api_key, customer_id, card_id, callback) {
    var stripe = require('stripe')(stripe_api_key);

    stripe.customers.deleteCard(
      customer_id,
      card_id,
      function(err, confirmation) {
        callback(err, confirmation);
      }
    );
  },
};
