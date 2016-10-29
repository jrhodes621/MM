var Plan = require('../models/plan');
var Subscription = require('../models/subscription');
var CustomerParser = require('./customer_parser');
var StripeManager = require('./stripe_manager');
var Step = require('step');

module.exports = {
  parse: function(stripe_api_key, subscriptions, plan, callback) {
    var numberOfSubscriptions = subscriptions.length;
    var users = [];

    if(numberOfSubscriptions == 0) {
      callback(null, []);
    }
    subscriptions.forEach(function(subscription) {
      Step(
        function getStripeCustomer() {
          StripeManager.getMember(stripe_api_key, subscription.customer, this);
        },
        function parseCustomer(err, customer) {
          CustomerParser.parse(customer, subscription, plan, this)
        },
        function addMember(err, user) {
          users.push(user);

          return users;
        },
        function doCallback(err, users) {
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
