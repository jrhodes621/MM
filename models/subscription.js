var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var SubscriptionServices = require('../models/subscription.services')

var SubscriptionSchema   = new Schema({
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan',
    required: true
  },
  membership: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Membership',
    required: true
  },
  reference_id: {
    type: String
  },
  subscription_created_at: {
    type: Date,
    required: true
  },
  subscription_canceled_at: {
    type: Date
  },
  trial_start: {
    type: Date
  },
  trial_end: {
    type: Date
  },
  status: {
    type: String,
    required: true
  },
  synced: {
    type: Boolean,
    required: true,
    default: false
  }
},
{
    timestamps: true
});

SubscriptionSchema.statics.SubscribeToPlan = SubscriptionServices.SubscribeToPlan
SubscriptionSchema.statics.GetSubscriptionByReferenceId = SubscriptionServices.GetSubscriptionByReferenceId
SubscriptionSchema.statics.GetMemberMooseFreePlan = SubscriptionServices.GetMemberMooseFreePlan
SubscriptionSchema.statics.GetMemberMoosePrimePlan = SubscriptionServices.GetMemberMoosePrimePlan

module.exports = mongoose.model('Subscription', SubscriptionSchema);
