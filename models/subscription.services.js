const Plan = require('../models/plan');

const SubscriptionServices = {
  SubscribeToPlan: function(membership, plan, referenceId, callback) {
    const subscription = new this();

    subscription.plan = plan;
    subscription.membership = membership;
    subscription.reference_id = referenceId;
    subscription.subscription_created_at = new Date();
    subscription.status = 'active';
    subscription.synced = false;

    subscription.save(callback);
  },
  GetSubscriptionByReferenceId: function(referenceId, callback) {
    this.findOne({ reference_id: referenceId })
    .populate('plan')
    .populate({
      path: 'plan',
      populate: [{
        path: 'user',
      }],
    })
    .exec(callback);
  },
  GetMemberMooseFreePlan: (callback) => {
    Plan.findOne({ reference_id: 'MM_FREE' })
    .populate('user')
    .populate({
      path: 'user',
      populate: [{
        path: 'account',
      }],
    })
    .exec(callback);
  },
  GetMemberMoosePrimePlan: (callback) => {
    Plan.findOne({}, callback);
  },
};

module.exports = SubscriptionServices;
