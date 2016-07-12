var mongoose = require('mongoose');
var Schema       = mongoose.Schema;

var SubscriptionSchema   = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan'
  }
},
{
    timestamps: true
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);
