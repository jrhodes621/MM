var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

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
    type: String,
    required: true
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
  }
},
{
    timestamps: true
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);
