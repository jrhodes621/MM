var StripeManager = require('./stripe_manager');
var Membership = require('../models/membership');
var User = require('../models/user');
var PaymentCard = require('../models/payment_card');
var PaymentCardHelper      = require('./payment_card_helper');
var Subscription = require('../models/subscription');
var SourceHelper      = require('./source_helper');
var UserHelper   = require('./user_helper');
var async = require("async");

module.exports = {
  parseCustomerFromStripe: function(bull, stripe_customer, callback) {
    console.log("parsing customer from stripe " + stripe_customer.email);
    async.waterfall([
      function createUser(callback) {
        console.log("creating new user");
        var user = new User();

        user.email_address = stripe_customer.email
        user.password = "test123"
        user.roles.push("Calf")
        user.reference_id = stripe_customer.id
        user.status = "Active"

        user.save(function(err) {
          callback(err, user);
        })
      },
      function addPaymentCards(user, callback) {
        console.log("adding payment cards");

        var stripe_sources = stripe_customer.sources.data;

        async.eachSeries(stripe_sources, function(source, callback) {
          var payment_card = new PaymentCard();

          payment_card.reference_id = source.id;
          payment_card.name = source.name;
          payment_card.brand = source.brand;
          payment_card.last4 = source.last_four;
          payment_card.exp_month = source.exp_month;
          payment_card.exp_year = source.exp_year;
          payment_card.status = source.status;

          payment_card.save(function(err) {
            if(err) { callback(err, user); }

            user.payment_cards.push(payment_card);
          })
        }, function(err) {
          callback(err, user);
        });
      },
      function addMembership(user, callback) {
        console.log("adding membership");

        var membership = new Membership();

        membership.reference_id = stripe_customer.id;
        membership.user = user;
        membership.company_name = bull.company_name;
        membership.account = bull;
        membership.member_since = stripe_customer.created;

        membership.save(function(err) {
          callback(err, user, membership);
        });
      },
      function addSubscriptions(user, membership) {
        console.log("adding supbscriptions");

        var stripe_subscriptions = stripe_customer.subscriptions.data;

        async.eachSeries(stripe_subscriptions, function(stripe_subscription) {
          async.waterfall([
            function getPlan(callback) {
              Plan.findOne({reference_id: plan_reference_id }, function(err, plan) {
                callback(err, plan);
              });
            },
            function addSubscription(plan, callback) {
              var subscription = new Subscription();

              subscription.plan = plan;
              subscription.membership = membership;
              subscription.reference_id = stripe_subscription.id;
              subscription.subscription_created_at = new Date();
              subscription.status = "Active";

              subscription.save(function(err) {
                if(err) { callback(err, user); }

                membership.subscriptions.push(subscription);
                membership.save(function(err) {
                  callback(err, user, membership);
                });
              });
            }
          ], function(err) {
            callback(err, user);
          });
        }, function(user) {
          callback(null, user);
        });
      }
    ], function(err, user) {
      console.log(err);
      console.log(user);

      callback(err, user)
    });
  },
  parse: function(bull, customer, stripe_subscription, plan, callback) {
    async.waterfall([
      function getUser(callback) {
        User.findOne({"email_address": customer.email}, callback);
      },
      function parseUser(user, callback) {
        if(!user) {
          user = new User();
          user.email_address = customer.email;
          user.password = "test123";
          user.status = "Active";
          user.memberships = [];

          user.save(function(err) {
            callback(err, user);
          });
        } else {
          callback(null, user);
        }
      }
    ], function(err, user) {
      callback(null, user);
    });
  }
}
