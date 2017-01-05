var request = require('request');

module.exports = {
  createCustomer: function(stripe_api_key, user, plan, callback) {
    var stripe = require('stripe')(stripe_api_key);

    stripe.customers.create({
      email: user.email_address,
      description: 'Customer for ' + user.email_address,
      plan: plan.reference_id
    }, function(err, customer) {
      callback(err, customer)
    });
  },
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
        console.log(err.type);
        callback(err, confirmation);
      }
    );
  },
  updateSubscription: function(stripe_api_key, subscription_id, plan_id, callback) {
    var stripe = require('stripe')(stripe_api_key);

    stripe.subscriptions.update(
      subscription_id,
      { plan: plan_id },
      function(err, subscription) {
        callback(err, subscription);
      }
    );
  },
  listSubscriptions: function(stripe_api_key, plan_id, last_subscription_id, stripe_subscriptions, callback) {
    var stripe = require('stripe')(stripe_api_key);

    var options = {
      plan: plan_id,
      limit: 100
    }
    if(last_subscription_id) {
      options["starting_after"] = last_subscription_id;
    }

    stripe.subscriptions.list(
      options,
      function(err, subscriptions) {
        if(err) { callback(err, stripe_subscriptions); }

        subscriptions.data.forEach(function(subscription) {
          stripe_subscriptions.push(subscription);
        });
        if(!subscriptions.has_more) {
          callback(err, stripe_subscriptions);
        } else {
          var last_id = subscriptions.data[subscriptions.data.length -1].id;

          module.exports.listSubscriptions(stripe_api_key, plan_id, last_id, stripe_subscriptions, callback);
        }
      }
    );
  },
  getSubscription: function(stripe_api_key, subscription_id, callback) {
    var stripe = require('stripe')(stripe_api_key);

    stripe.subscriptions.retrieve(
      subscription_id,
      function(err, subscription) {
        callback(err, subscription);
      }
    );
  },
  listPlans: function(stripe_api_key, callback) {
    var stripe = require('stripe')(stripe_api_key);

    stripe.plans.list(
      {
        limit: 100
      },
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

    stripe.plans.update(plan.reference_id, {
      name: plan.name,
      trial_period_days: plan.trial_period_days,
      metadata: {
        'description': plan.description,
        'termsofservice': plan.terms_of_service,
      }
    }, function(err, plan) {
      callback(err, plan);
    });
  },
  deletePlan: function(stripe_api_key, plan, callback) {
    var stripe = require('stripe')(stripe_api_key);

    stripe.plans.del(
      plan.reference_id,
      function(err, confirmation) {
        callback(err, confirmation)
      }
    );
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
  getCustomer: function(stripe_api_key, customer_id, callback) {
    var stripe = require('stripe')(stripe_api_key);

    stripe.customers.retrieve(
      customer_id,
      function(err, customer) {
        callback(err, customer);
      }
    );
  },
  createCharge: function(stripe_api_key, customer, amount, currency, description, callback) {
    var stripe = require('stripe')(stripe_api_key);

    stripe.charges.create({
      amount: amount*100,
      currency: currency,
      customer: customer,
      description: description
    }, function(err, charge) {
      callback(err, charge);
    });
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
