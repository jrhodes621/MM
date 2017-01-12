var mongoose = require('mongoose');
var Schema       = mongoose.Schema;

var MembershipSchema   = new Schema({
  reference_id: {
    type: String
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  company_name: {
    type: String
  },
  member_since: {
    type: Date,
    required: true
  },
  subscriptions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription',
    default: []
  }]
});

module.exports = mongoose.model('Membership', MembershipSchema);
