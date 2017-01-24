var Plan          = require('../models/plan');
var Subscription  = require('../models/subscription');

var SubscriptionServices = {
  SubscribeToPlan: function(membership, plan, reference_id, callback) {
    var subscription = new this();

    subscription.plan = plan;
    subscription.membership = membership;
    subscription.reference_id = reference_id;
    subscription.subscription_created_at = new Date();
    subscription.status = "active";
    subscription.synced = false;

    subscription.save(callback);
  },
  GetSubscriptionByReferenceId: function(reference_id, callback) {
    Subscription.findOne(reference_id )
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
  GetMemberMooseFreePlan: function(callback) {
    Plan.findOne({reference_id: 'MM_FREE'})
    .populate('user')
    .populate({
      path: 'user',
      populate: [{
        path: 'account'
      }]
    })
    .exec(function(err, plan) {
      if(err) { return callback(err, null); }

      callback(null, plan);
    });
  },
  GetMemberMoosePrimePlan: function(callback) {
    Plan.findOne({}, function(err, plan) {
      if(err) { return callback(err, null); }

      callback(null, plan);
    });
  }
}

module.exports = SubscriptionServices
