var mongoose = require('mongoose');
var Schema       = mongoose.Schema;

var MembershipSchema   = new Schema({
  reference_id: {
    type: String
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  company_name: {
    type: String
  },
  plans: [{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    default: []
  }],
  member_since: {
    type: Date
  },
  subscriptions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription',
    default: []
  }]
});

module.exports = mongoose.model('Membership', MembershipSchema);
