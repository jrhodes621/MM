var Plan = require('../models/plan');
var Subscription = require('../models/subscription');

module.exports = {
  subscribeToPlan: function(user, plan, callback) {
    var subscription = new Subscription();

    subscription.user = user;
    subscription.plan = plan;

    subscription.save(function(err) {
      if(err)
        callback(err, null);

      callback(null, subscription);
    });

  },
  getFreePlan: function(callback) {
    Plan.findOne({}, function(err, plan) {
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
