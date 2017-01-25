var request = require('request');

function getPlans(stripeApiKey, options, callback) {
  var stripe = require('stripe')(stripeApiKey);

  stripe.plans.list(options, callback);
}
function getCharges(stripeApiKey, options, callback) {
  var stripe = require('stripe')(stripeApiKey);

  stripe.charges.list(options, callback);
}
function getCoupons(stripeApiKey, options, callback) {
  var stripe = require('stripe')(stripeApiKey);

  stripe.coupons.list(options, callback);
}
function getInvoices(stripeApiKey, options, callback) {
  var stripe = require('stripe')(stripeApiKey);

  stripe.invoices.list(options, callback);
}
function getSubscriptions(stripeApiKey, options, callback) {
  var stripe = require('stripe')(stripeApiKey);

  stripe.subscriptions.list(options, callback);
}
function getPlanCount(stripeApiKey, options, total_count, callback) {
  getPlans(stripeApiKey, options, function(err, plans) {
    if(err) { callback(err, total_count); }

    total_count += plans.data.length;

    if(!plans.has_more) {
      callback(err, total_count);
    } else {
      var options = {
        limit: 100,
        starting_after: plans.data[plans.data.length -1].id
      }
      getPlanCount(stripeApiKey, options, total_count, callback);
    }
  });
}
function getSubscriptionCount(stripeApiKey, options, total_count, callback) {
  getSubscriptions(stripeApiKey, options, function(err, subscriptions) {
    if(err) { callback(err, total_count); }

    total_count += subscriptions.data.length;

    if(!subscriptions.has_more) {
      callback(err, total_count);
    } else {
      var options = {
        limit: 100,
        starting_after: subscriptions.data[subscriptions.data.length -1].id
      }
      getSubscriptionCount(stripeApiKey, options, total_count, callback);
    }
  });
}
function getChargeCount(stripeApiKey, options, total_count, callback) {
  getCharges(stripeApiKey, options, function(err, charges) {
    if(err) { return callback(err, total_count); }

    total_count += charges.data.length;

    if(!charges.has_more) {
      return callback(err, total_count);
    } else {
      var options = {
        limit: 100,
        starting_after: charges.data[charges.data.length -1].id
      }
      getChargeCount(stripeApiKey, options, total_count, callback);
    }
  });
}
function getCouponCount(stripeApiKey, options, total_count, callback) {
  getCoupons(stripeApiKey, options, function(err, coupons) {
    if(err) { callback(err, total_count); }

    total_count += coupons.data.length;

    if(!coupons.has_more) {
      callback(err, total_count);
    } else {
      var options = {
        limit: 100,
        starting_after: coupons.data[coupons.data.length -1].id
      }
      getCouponCount(stripeApiKey, options, total_count, callback);
    }
  });
}
function getInvoiceCount(stripeApiKey, options, total_count, callback) {
  getInvoices(stripeApiKey, options, function(err, invoices) {
    if(err) { callback(err, total_count); }

    total_count += invoices.data.length;

    if(!invoices.has_more) {
      callback(err, total_count);
    } else {
      var options = {
        limit: 100,
        starting_after: invoices.data[invoices.data.length -1].id
      }
      getInvoiceCount(stripeApiKey, options, total_count, callback);
    }
  });
}
module.exports = {
  createCustomer: function(stripeApiKey, user, plan, callback) {
    var stripe = require('stripe')(stripeApiKey);

    stripe.customers.create({
      email: user.email_address,
      description: 'Customer for ' + user.email_address,
      plan: plan.reference_id
    }, function(err, customer) {
      callback(err, customer)
    });
  },
  subscribeCustomerToPlan: function(stripeApiKey, customer_id, plan_id, callback) {
    var stripe = require('stripe')(stripeApiKey);

    stripe.subscriptions.create({
      customer: customer_id,
      plan: plan_id
    }, function(err, subscription) {
        callback(err, subscription);
      }
    );
  },
  createSubscription: function(stripeApiKey, token, plan_id, email, callback) {
    var stripe = require('stripe')(stripeApiKey);

    stripe.customers.create({
      source: token, // obtained with Stripe.js
      plan: plan_id,
      email: email
    }, function(err, customer) {
      callback(err, customer);
    });
  },
  cancelSubscription: function(stripeApiKey, subscription_id, callback) {
    var stripe = require('stripe')(stripeApiKey);

    stripe.subscriptions.del(
      subscription_id,
      function(err, confirmation) {
        console.log(err.type);
        callback(err, confirmation);
      }
    );
  },
  updateSubscription: function(stripeApiKey, subscription_id, plan_id, callback) {
    var stripe = require('stripe')(stripeApiKey);

    stripe.subscriptions.update(
      subscription_id,
      { plan: plan_id },
      function(err, subscription) {
        callback(err, subscription);
      }
    );
  },
  listSubscriptions: function(stripeApiKey, plan_id, last_subscription_id, stripe_subscriptions, callback) {
    var stripe = require('stripe')(stripeApiKey);

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

          module.exports.listSubscriptions(stripeApiKey, plan_id, last_id, stripe_subscriptions, callback);
        }
      }
    );
  },
  getSubscription: function(stripeApiKey, subscription_id, callback) {
    var stripe = require('stripe')(stripeApiKey);

    stripe.subscriptions.retrieve(
      subscription_id,
      function(err, subscription) {
        callback(err, subscription);
      }
    );
  },
  getNumberOfPlans: function(stripeApiKey, callback) {
    var total_count = 0;
    var options = {
      limit: 100
    }

    getPlanCount(stripeApiKey, options, total_count, function(err, total_count) {
      callback(err, total_count)
    });
  },
  getNumberOfSubscriptions: function(stripeApiKey, callback) {
    var total_count = 0;
    var options = {
      limit: 100
    }

    getSubscriptionCount(stripeApiKey, options, total_count, function(err, total_count) {
      callback(err, total_count)
    });
  },
  getNumberOfCharges: function(stripeApiKey, callback) {
    var total_count = 0;
    var options = {
      limit: 100
    }

    getChargeCount(stripeApiKey, options, total_count, function(err, total_count) {
      callback(err, total_count)
    });
  },
  getNumberOfCoupons: function(stripeApiKey, callback) {
    var total_count = 0;
    var options = {
      limit: 100
    }

    getCouponCount(stripeApiKey, options, total_count, function(err, total_count) {
      callback(err, total_count)
    });
  },
  getNumberOfInvoices: function(stripeApiKey, callback) {
    var total_count = 0;
    var options = {
      limit: 100
    }

    getInvoiceCount(stripeApiKey, options, total_count, function(err, total_count) {
      callback(err, total_count)
    });
  },
  listPlans: function(stripeApiKey, callback) {
    var stripe = require('stripe')(stripeApiKey);

    stripe.plans.list(
      {
        limit: 100
      },
      function(err, plans) {
        callback(err, plans);
      }
    );
  },
  getPlan: function(stripeApiKey, plan_id, callback) {
    var stripe = require('stripe')(stripeApiKey);

    stripe.plans.retrieve(
      plan_id,
      function(err, plan) {
        callback(err, plan);
      }
    );
  },
  createPlan: function(stripeApiKey, plan, callback) {
    var stripe = require('stripe')(stripeApiKey);

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
  updatePlan: function(stripeApiKey, plan, callback) {
    var stripe = require('stripe')(stripeApiKey);

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
  deletePlan: function(stripeApiKey, plan, callback) {
    var stripe = require('stripe')(stripeApiKey);

    stripe.plans.del(
      plan.reference_id,
      function(err, confirmation) {
        callback(err, confirmation)
      }
    );
  },
  listMembers: function(stripeApiKey, callback) {
    var stripe = require('stripe')(stripeApiKey);

    stripe.customers.list(
      { limit: 12},
      function(err, plans) {
        callback(err, plans);
      }
    );
  },
  getCustomer: function(stripeApiKey, customer_id, callback) {
    var stripe = require('stripe')(stripeApiKey);

    stripe.customers.retrieve(
      customer_id,
      function(err, customer) {
        callback(err, customer);
      }
    );
  },
  createCharge: function(stripeApiKey, customer, amount, currency, description, callback) {
    var stripe = require('stripe')(stripeApiKey);

    stripe.charges.create({
      amount: amount*100,
      currency: currency,
      customer: customer,
      description: description
    }, function(err, charge) {
      callback(err, charge);
    });
  },
  listCharges: function(stripeApiKey, customer_id, callback) {
    var stripe = require('stripe')(stripeApiKey);

    stripe.charges.list({
      limit: 20,
      customer: customer_id
    }, function(err, charges) {
        callback(err, charges);
      }
    );
  },
  getCharge: function(stripeApiKey, charge_id, callback) {
    var stripe = require('stripe')(stripeApiKey);

    stripe.charges.retrieve(
      charge_id,
      function(err, charge) {
        callback(err, charge);
      }
    );
  },
  createCoupon: function(stripeApiKey, coupon, callback) {
    var stripe = require('stripe')(stripeApiKey);

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
  listCoupons: function(stripeApiKey, callback) {
    var stripe = require('stripe')(stripeApiKey);

    stripe.coupons.list(
      { limit: 100 },
      function(err, coupons) {
        callback(err, coupons);
      }
    );
  },
  listInvoices: function(stripeApiKey, customer_id, callback) {
    var stripe = require('stripe')(stripeApiKey);

    stripe.invoices.list(
      {
        limit: 100,
        customer: customer_id
      },
      function(err, invoices) {
        callback(err, invoices);
      });
  },
  getInvoice: function(stripeApiKey, invoice_id, callback) {
    var stripe = require('stripe')(stripeApiKey);

    stripe.invoices.retrieve(
      invoice_id,
      function(err, invoice) {
        callback(err, invoice);
      }
    );
  },
  listCards: function(stripeApiKey, customer_id, callback) {
    var stripe = require('stripe')(stripeApiKey);

    stripe.customers.listCards(customer_id, function(err, cards) {
      callback(err, cards);
    });
  },
  createCard: function(stripeApiKey, customer_id, token, callback) {
    var stripe = require('stripe')(stripeApiKey);

    stripe.customers.createSource(
      customer_id,
      {source: token},
      function(err, card) {
        callback(err, card);
      }
    );
  },
  getCard: function(stripeApiKey, customer_id, card_id, callback) {
    var stripe = require('stripe')(stripeApiKey);

    stripe.customers.retrieveCard(
      customer_id,
      card_id,
      function(err, card) {
        callback(err, card);
      }
    );
  },
  updateCard: function(stripeApiKey, customer_id, card_id, card,callback) {
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
  deleteCard: function(stripeApiKey, customer_id, card_id, callback) {
    var stripe = require('stripe')(stripeApiKey);

    stripe.customers.deleteCard(
      customer_id,
      card_id,
      function(err, confirmation) {
        callback(err, confirmation);
      }
    );
  },
};
