const mongoose = require('mongoose');
const SubscriptionServices = require('../models/subscription.services');

const Schema = mongoose.Schema;

const SubscriptionSchema = new Schema({
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan',
    required: true,
  },
  membership: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Membership',
    required: true,
  },
  reference_id: {
    type: String,
  },
  subscription_created_at: {
    type: Date,
    required: true,
  },
  subscription_canceled_at: {
    type: Date,
  },
  trial_start: {
    type: Date,
  },
  trial_end: {
    type: Date,
  },
  status: {
    type: String,
    required: true,
  },
  synced: {
    type: Boolean,
    required: true,
    default: false,
  },
}, {
  timestamps: true,
});

SubscriptionSchema.statics = {
  SubscribeToPlan: SubscriptionServices.SubscribeToPlan,
  GetSubscriptionByReferenceId: SubscriptionServices.GetSubscriptionByReferenceId,
  GetMemberMooseFreePlan: SubscriptionServices.GetMemberMooseFreePlan,
  GetMemberMoosePrimePlan: SubscriptionServices.GetMemberMoosePrimePlan,
};

module.exports = mongoose.model('Subscription', SubscriptionSchema);
