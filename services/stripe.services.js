var request = require('request');

function getPlans(stripe_api_key, options, callback) {
  var stripe = require('stripe')(stripe_api_key);

  stripe.plans.list(options, callback);
}
function getCharges(stripe_api_key, options, callback) {
  var stripe = require('stripe')(stripe_api_key);

  stripe.charges.list(options, callback);
}
function getCoupons(stripe_api_key, options, callback) {
  var stripe = require('stripe')(stripe_api_key);

  stripe.coupons.list(options, callback);
}
function getInvoices(stripe_api_key, options, callback) {
  var stripe = require('stripe')(stripe_api_key);

  stripe.invoices.list(options, callback);
}
function getSubscriptions(stripe_api_key, options, callback) {
  var stripe = require('stripe')(stripe_api_key);

  stripe.subscriptions.list(options, callback);
}
function getPlanCount(stripe_api_key, options, total_count, callback) {
  getPlans(stripe_api_key, options, function(err, plans) {
    if(err) { callback(err, total_count); }

    total_count += plans.data.length;

    if(!plans.has_more) {
      callback(err, total_count);
    } else {
      var options = {
        limit: 100,
        starting_after: plans.data[plans.data.length -1].id
      }
      getPlanCount(stripe_api_key, options, total_count, callback);
    }
  });
}
function getSubscriptionCount(stripe_api_key, options, total_count, callback) {
  getSubscriptions(stripe_api_key, options, function(err, subscriptions) {
    if(err) { callback(err, total_count); }

    total_count += subscriptions.data.length;

    if(!subscriptions.has_more) {
      callback(err, total_count);
    } else {
      var options = {
        limit: 100,
        starting_after: subscriptions.data[subscriptions.data.length -1].id
      }
      getSubscriptionCount(stripe_api_key, options, total_count, callback);
    }
  });
}
function getChargeCount(stripe_api_key, options, total_count, callback) {
  getCharges(stripe_api_key, options, function(err, charges) {
    if(err) { return callback(err, total_count); }

    total_count += charges.data.length;

    if(!charges.has_more) {
      return callback(err, total_count);
    } else {
      var options = {
        limit: 100,
        starting_after: charges.data[charges.data.length -1].id
      }
      getChargeCount(stripe_api_key, options, total_count, callback);
    }
  });
}
function getCouponCount(stripe_api_key, options, total_count, callback) {
  getCoupons(stripe_api_key, options, function(err, coupons) {
    if(err) { callback(err, total_count); }

    total_count += coupons.data.length;

    if(!coupons.has_more) {
      callback(err, total_count);
    } else {
      var options = {
        limit: 100,
        starting_after: coupons.data[coupons.data.length -1].id
      }
      getCouponCount(stripe_api_key, options, total_count, callback);
    }
  });
}
function getInvoiceCount(stripe_api_key, options, total_count, callback) {
  getInvoices(stripe_api_key, options, function(err, invoices) {
    if(err) { callback(err, total_count); }

    total_count += invoices.data.length;

    if(!invoices.has_more) {
      callback(err, total_count);
    } else {
      var options = {
        limit: 100,
        starting_after: invoices.data[invoices.data.length -1].id
      }
      getInvoiceCount(stripe_api_key, options, total_count, callback);
    }
  });
}
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
  getNumberOfPlans: function(stripe_api_key, callback) {
    var total_count = 0;
    var options = {
      limit: 100
    }

    getPlanCount(stripe_api_key, options, total_count, function(err, total_count) {
      callback(err, total_count)
    });
  },
  getNumberOfSubscriptions: function(stripe_api_key, callback) {
    var total_count = 0;
    var options = {
      limit: 100
    }

    getSubscriptionCount(stripe_api_key, options, total_count, function(err, total_count) {
      callback(err, total_count)
    });
  },
  getNumberOfCharges: function(stripe_api_key, callback) {
    var total_count = 0;
    var options = {
      limit: 100
    }

    getChargeCount(stripe_api_key, options, total_count, function(err, total_count) {
      callback(err, total_count)
    });
  },
  getNumberOfCoupons: function(stripe_api_key, callback) {
    var total_count = 0;
    var options = {
      limit: 100
    }

    getCouponCount(stripe_api_key, options, total_count, function(err, total_count) {
      callback(err, total_count)
    });
  },
  getNumberOfInvoices: function(stripe_api_key, callback) {
    var total_count = 0;
    var options = {
      limit: 100
    }

    getInvoiceCount(stripe_api_key, options, total_count, function(err, total_count) {
      callback(err, total_count)
    });
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
  getCharge: function(stripe_api_key, charge_id, callback) {
    var stripe = require('stripe')(stripe_api_key);

    stripe.charges.retrieve(
      charge_id,
      function(err, charge) {
        callback(err, charge);
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
      { limit: 100 },
      function(err, coupons) {
        callback(err, coupons);
      }
    );
  },
  listInvoices: function(stripe_api_key, customer_id, callback) {
    var stripe = require('stripe')(stripe_api_key);

    stripe.invoices.list(
      {
        limit: 100,
        customer: customer_id
      },
      function(err, invoices) {
        callback(err, invoices);
      });
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
