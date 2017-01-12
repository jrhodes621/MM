var SubscriptionServices = {
  SubscribeToPlan: function(user, plan, callback) {
    var subscription = new Subscription();

    this.plan = plan;
    this.save(function(err) {
      if(err) { return callback(err, null); }

      callback(null, subscription);
    });
  },
  GetSubscriptionByReferenceId: function(subscription_id, callback) {
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
