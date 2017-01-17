var request = require('request');
var Charge = require('../models/charge');
var Membership = require('../models/membership');
var PaymentCard = require('../models/payment_card');
var Plan = require('../models/plan');
var Subscription = require('../models/subscription');
var User = require('../models/user');

var StripePlanParser                  = require('../parsers/stripe/plan_parser');
var StripeCustomerSubscriptionParser  = require('../parsers/stripe/customer_subscription_parser');
var StripeChargeParser                = require('../parsers/stripe/charge_parser');
var StripeCouponParser                = require('../parsers/stripe/coupon_parser');
var StripeInvoiceParser               = require('../parsers/stripe/invoice_parser');

var StripeServices                    = require('../services/stripe.services');

var async = require("async");

function processImport(bull, callback) {
  var imported_plans = [];
  var imported_subscriptions = [];
  var imported_charges = [];
  var imported_coupons = [];
  var imported_invoices = [];

  async.waterfall([
    function getPlans(callback) {
      console.log("Importing Plans");

      importPlans(bull, function(err, plans) {
        imported_plans = plans;

        callback(err, bull, plans);
      });
    },
    function getSubscriptions(bull, plans, callback) {
      console.log("Importing Subscriptions");

      importSubscriptions(bull, plans, function(err, subscriptions) {
        imported_subscriptions = subscriptions;

        callback(err, bull, plans, subscriptions);
      });
    },
    function getCharges(bull, plans, subscriptions, callback) {
      console.log("Import Charges");

      importCharges(bull, subscriptions, function(err, charges) {
        imported_charges = charges;

        callback(err, bull, plans, subscriptions);
      });
    },
    function getCoupons(bull, plans, subscriptions, callback) {
      console.log("Import Coupons");

      importCoupons(bull, function(err, coupons) {
        imported_coupons = coupons;

        callback(err, bull, plans, subscriptions);
      });
    },
    function getInvoices(bull, plans, subscriptions, callback) {
      console.log("Import Invoices");

      importInvoices(bull, subscriptions, function(err, invoices) {
        imported_invoices = invoices;

        callback(err);
      });
    }
  ], function(err) {
    callback(err, imported_plans, imported_subscriptions, imported_charges, imported_coupons, imported_invoices);
  });
}
function importPlans(bull, callback) {
  var stripe_api_key = bull.stripe_connect.access_token;
  var all_plans = [];

  async.waterfall([
    function getStripePlans(callback) {
      StripeServices.listPlans(stripe_api_key, function(err, stripe_plans) {
        callback(err, stripe_plans.data);
      });
    },
    function parsePlans(stripe_plans, callback) {
      async.eachSeries(stripe_plans, function(stripe_plan, callback) {
        StripePlanParser.parse(bull, stripe_plan, function(err, plan) {
          console.log("Import Plan " + plan.name);

          all_plans.push(plan);

          callback(err, plan);
        });
      }, function(err) {
        callback(err);
      });
    }
  ], function(err) {
    console.log("Imported " + all_plans.length + " plan.");

    callback(err, all_plans);
  });
}
function importSubscriptions(bull, plans, callback) {
  var stripe_api_key = bull.stripe_connect.access_token;
  var all_subscriptions_all_plans = [];

  async.eachSeries(plans, function(plan, callback) {
    var all_subscriptions = [];
    async.waterfall([
      function getSubscriptionsFromStripe(callback) {
        StripeServices.listSubscriptions(stripe_api_key, plan.reference_id, null, [], callback);
      },
      function parseSubscriptions(stripe_subscriptions, callback) {
        async.eachSeries(stripe_subscriptions, function(stripe_subscription, callback) {
          StripeCustomerSubscriptionParser.parse(bull, stripe_subscription, function(err, subscription) {
            all_subscriptions.push(subscription);

            callback(err, subscription);
          });
        }, function(err) {
          callback(err);
        })
      }
    ], function(err) {
      console.log("Imported " + all_subscriptions.length + " subscriptions for " + plan.name + " plan.");
      all_subscriptions_all_plans.push.apply(all_subscriptions_all_plans, all_subscriptions);

      callback(err);
    });
  }, function(err) {
    console.log("Imported " + all_subscriptions_all_plans.length + " subscriptions for all " + plans.length + " plans.");

    callback(err, all_subscriptions_all_plans);
  });
}
function importCharges(bull, subscriptions, callback) {
  var stripe_api_key = bull.stripe_connect.access_token;
  var all_charges_all_memberships = [];

  async.eachSeries(subscriptions, function(subscription, callback) {
    var all_charges = [];
    async.waterfall([
      function getStripeCharges(callback) {
        StripeServices.listCharges(stripe_api_key, subscription.membership.reference_id, function(err, stripe_charges) {
          callback(err, stripe_charges.data, subscription.membership);
        });
      },
      function parseCharges(stripe_charges, membership, callback) {
        async.eachSeries(stripe_charges, function(stripe_charge, callback) {
          StripeChargeParser.parse(membership, stripe_charge, "Active", function(err, charge) {
            all_charges.push(charge);

            callback(err)
          })
        }, function(err) {
          callback(err, all_charges)
        })
      }
    ], function(err) {
      console.log("Imported " + all_charges.length + " charges for " + subscription.membership.user.email_address + ".");

      all_charges_all_memberships.push.apply(all_charges_all_memberships, all_charges);
      callback(err);
    });
  }, function(err) {
    console.log("Imported " + all_charges_all_memberships.length + " charges.");

    callback(err, all_charges_all_memberships);
  });
}
function importCoupons(bull, callback) {
  var stripe_api_key = bull.stripe_connect.access_token;
  var all_coupons = [];

  async.waterfall([
    function getStripeCoupons(callback) {
      StripeServices.listCoupons(stripe_api_key, function(err, stripe_coupons) {
        callback(err, stripe_coupons);
      });
    },
    function parseCoupons(stripe_coupons, callback) {
      async.eachSeries(stripe_coupons.data, function(stripe_coupon, callback) {
        StripeCouponParser.parse(bull, stripe_coupon, function(err, coupon) {
          all_coupons.push(coupon);

          callback(err)
        })
      }, function(err) {
        callback(err);
      })
    }
  ], function(err) {
    console.log("Imported " + all_coupons.length + " coupons.");

    callback(err, all_coupons);
  });
}
function importInvoices(bull, subscriptions, callback) {
  var stripe_api_key = bull.stripe_connect.access_token;
  var all_invoices_all_memberships = [];

  async.eachSeries(subscriptions, function(subscription, callback) {
    var all_invoices = [];
    async.waterfall([
      function getStripeCharges(callback) {
        StripeServices.listInvoices(stripe_api_key, subscription.membership.reference_id, function(err, stripe_invoices) {
          callback(err, stripe_invoices.data, subscription.membership);
        });
      },
      function parseInvoices(stripe_invoices, membership, callback) {
        async.eachSeries(stripe_invoices, function(stripe_invoice, callback) {
          StripeInvoiceParser.parse(bull, stripe_invoice, membership, function(err, invoice) {
            all_invoices.push(invoice);

            callback(err)
          })
        }, function(err) {
          callback(err)
        })
      }
    ], function(err) {
      console.log("Imported " + all_invoices.length + " invoices for " + subscription.membership.user.email_address + ".");

      all_invoices_all_memberships.push.apply(all_invoices_all_memberships, all_invoices);
      callback(err);
    });
  }, function(err) {
    console.log("Imported " + all_invoices_all_memberships.length + " invoices.");

    callback(err, all_invoices_all_memberships);
  });
}

module.exports = {
  processImport
}
