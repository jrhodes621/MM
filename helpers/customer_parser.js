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
  parseCustomerFromStripe: function(user, bull, stripe_customer, callback) {
    console.log("parsing customer from stripe " + stripe_customer.email);

    async.waterfall([
      function createUser(callback) {
        console.log(user);

        if(!user) {
          user = new User();

          user.password = "test123"
        }

        user.email_address = stripe_customer.email
        user.roles.push("Calf")
        user.reference_id = stripe_customer.id
        user.status = "Active"

        user.save(function(err) {
          callback(err, user);
        })
      },
      function addPaymentCards(user, callback) {
        var stripe_sources = stripe_customer.sources.data;

        async.eachSeries(stripe_sources, function(source, callback) {
          async.waterfall([
            function getPaymentCard(callback) {
              PaymentCard.findOne({ reference_id: source.id }, function(err, payment_card) {
                callback(err, payment_card);
              });
            },
            function parsePaymentCard(payment_card, callback) {
              var new_payment_card = false;

              if(!payment_card) {
                new_payment_card = true;

                payment_card = new PaymentCard();
              }
              payment_card.reference_id = source.id;
              payment_card.name = source.name;
              payment_card.brand = source.brand;
              payment_card.last4 = source.last4;
              payment_card.exp_month = source.exp_month;
              payment_card.exp_year = source.exp_year;
              payment_card.status = "Active";

              payment_card.save(function(err) {
                if(err) { callback(err, user); }

                if(new_payment_card) {
                  user.payment_cards.push(payment_card);
                }

                callback(null, user);
              });
            }
          ], function(err) {
            callback(err);
          });
        }, function(err) {
          callback(err, user);
        });
      },
      function getMembership(user, callback) {
        Membership.findOne({ user: user }, function(err, membership) {
          callback(err, user, membership);
        });
      },
      function parseMembership(user, membership, callback) {
        if(!membership) {
          membership = new Membership();
        }
        membership.reference_id = stripe_customer.id;
        membership.user = user;
        membership.company_name = bull.company_name;
        membership.account = bull;
        membership.member_since = stripe_customer.created;

        membership.save(function(err) {
          console.log(user.memberships.indexOf(membership._id));

          if (user.memberships.indexOf(membership._id) === -1) {
              user.memberships.push(membership);
          }

          callback(err, user, membership);
        });
      },
      function parseSubscriptions(user, membership, callback) {
        var stripe_subscriptions = stripe_customer.subscriptions.data;

        async.eachSeries(stripe_subscriptions, function(stripe_subscription) {
          async.waterfall([
            function getPlan(callback) {
              Plan.findOne({reference_id: plan_reference_id }, function(err, plan) {
                callback(err, plan);
              });
            },
            function getSubscription(plan, callback) {
              Subscription.findOne({ reference_id: stripe_subscription.id}, function(err, subscription) {
                callback(err, plan, subscription)
              });
            },
            function parseSubscription(plan, subscription, callback) {
              var new_subscription = false;
              if(!subscription) {
                new_subscription = true;

                subscription = new Subscription();
                subscription.subscription_created_at = new Date();
              }

              subscription.plan = plan;
              subscription.membership = membership;
              subscription.reference_id = stripe_subscription.id;
              subscription.status = "Active";

              subscription.save(function(err) {
                if(err) { callback(err, user); }

                if(new_subscription) {
                  membership.subscriptions.push(subscription);
                }
                membership.save(function(err) {
                  callback(err, user, membership);
                });
              });
            }
          ], function(err) {
            callback(err);
          });
        }, function(err, user) {
          callback(err);
        });
      }
    ], function(err) {
      user.save(function(err) {
        callback(err, user);
      })
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
