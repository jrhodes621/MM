var mongoose              = require('mongoose');
var Schema                = mongoose.Schema;
var MembershipServices    = require('../models/membership.services')

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
MembershipSchema.statics.CreateMembership = MembershipServices.CreateMembership
MembershipSchema.statics.GetMembership = MembershipServices.GetMembership
MembershipSchema.statics.GetMembershipById = MembershipServices.GetMembershipById
MembershipSchema.statics.GetMembershipByReferenceId = MembershipServices.GetMembershipByReferenceId

module.exports = mongoose.model('Membership', MembershipSchema);
