var Plan = require('../models/plan');
var Subscription = require('../models/subscription');
var CustomerParser = require('./customer_parser');
var StripeManager = require('./stripe_manager');
var Step = require('step');

module.exports = {
  parse: function(bull, stripe_api_key, subscriptions, plan, callback) {
    console.log("***Parse Subscriptions***");
    console.log(subscriptions.length);

    var numberOfSubscriptions = subscriptions.length;
    var users = [];

    if(numberOfSubscriptions == 0) {
      callback(null, []);
    }
    subscriptions.forEach(function(subscription) {
      Step(
        function getStripeCustomer() {
          console.log("***Get Customer from Stripe***");

          StripeManager.getCustomer(stripe_api_key, subscription.customer, this);
        },
        function parseCustomer(err, customer) {
          if(err) { console.log(err) }

          console.log("***Parse Customer***");

          CustomerParser.parse(bull, customer, subscription, plan, this)
        },
        function addMember(err, user) {
          if(err) { console.log(err) }

          console.log("***Add Member to Users***");

          users.push(user);

          return users;
        },
        function doCallback(err, users) {
          if(err) { console.log(err) }

          console.log("***Do Callback***");

          numberOfSubscriptions -= 1;
          if(numberOfSubscriptions == 0) {
            callback(err, users)
          }
        }
      );
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
