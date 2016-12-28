var mongoose = require('mongoose');
var Schema       = mongoose.Schema;

var MemberSchema   = new Schema({
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  email_address: {
    type: String,
    required: true
  },
  member_since: {
    type: Date
  },
  reference_id: {
    type: String,
    required: true
  },
  plans: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan',
    default: []
  }],
  subscriptions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription',
    default: []
  }]
});

module.exports = mongoose.model('Member', MemberSchema);
