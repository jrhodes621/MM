var Membership = require('../models/membership');
var Plan = require('../models/plan');
var Subscription = require('../models/subscription');
var CustomerParser = require('./customer_parser');
var SourceHelper      = require('./source_helper');
var StripeManager = require('./stripe_manager');
var async = require("async");

module.exports = {
  parse: function(bull, stripe_api_key, subscriptions, plan, callback) {
    var addedUsers = [];

    async.eachSeries(subscriptions, function(stripe_subscription, callback) {
      async.waterfall([
        function getStripeCustomer(callback) {
          StripeManager.getCustomer(stripe_api_key, stripe_subscription.customer, callback);
        },
        function parseCustomer(customer, callback) {
          CustomerParser.parse(bull, customer, stripe_subscription, plan, function(err, user) {
            callback(err, customer, user);
          });
        },
        function addUserMemberships(customer, user, callback) {
          var membership = new Membership();

          membership.reference_id = customer.id;
          membership.user = user;
          membership.company_name = bull.account.company_name;
          membership.account = bull.account;
          membership.member_since = customer.created;

          var subscription = new Subscription();

          subscription.plan = plan;
          subscription.reference_id = stripe_subscription.id;
          subscription.subscription_created_at = stripe_subscription.created_at;
          subscription.subscription_canceled_at = stripe_subscription.canceled_at;
          subscription.trial_start = stripe_subscription.trial_start;
          subscription.trial_end = stripe_subscription.trial_end;
          subscription.status = stripe_subscription.status;
          subscription.membership = membership;

          subscription.save(function(err) {
            if(err) { return callback(err, customer, user); }

            membership.subscriptions.push(subscription);
            plan.members.push(user);

            membership.save(function(err) {
              if(err) { return callback(err, customer, user); }

              user.memberships.push(membership);

              callback(err, customer, user);
            });
          });
        },
        function parsePaymentCards(customer, user, callback) {
          SourceHelper.parse(user, customer, function(err) {
            callback(err, user);
          });
        },
        function saveUser(user, callback) {
          user.save(function(err) {
            plan.members.push(user);
            
            callback(err, user);
          })
        }
      ], function(err, users) {
        addedUsers.push(users);

        callback(err);
      });
    }, function(err) {
      callback(err, addedUsers);
    });
  },
  subscribeToPlan: function(user, plan, callback) {
    var subscription = new Subscription();

    subscription.plan = plan;

    subscription.save(function(err) {
      if(err)
        callback(err, null);

      callback(null, subscription);
    });

  },
  getSubscription: function(subscription_id, callback) {
    Subscription.findOne({ "reference_id": subscription_id })
    .populate('plan')
    .populate({
      path: 'plan',
      populate: [{
        path: 'user'
      }]
    })
    .exec(function(err, subscription) {
      callback(err, subscription)
    })
  },
  getFreePlan: function(callback) {
    Plan.findOne({reference_id: 'MM_FREE'})
    .populate('user')
    .populate({
      path: 'user',
      populate: [{
        path: 'account'
      }]
    })
    .exec(function(err, plan) {
      if(err)
        callback(err, null);

      callback(null, plan);
    });
  },
  getPrimePlan: function(callback) {
    Plan.findOne({}, function(err, plan) {
      if(err)
        callback(err, null);

      callback(null, plan);
    });
  }
};
