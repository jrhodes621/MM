const mongoose = require('mongoose');
const MembershipServices = require('../models/membership.services');

const Schema = mongoose.Schema;

const MembershipSchema = new Schema({
  reference_id: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
  },
  company_name: {
    type: String,
  },
  member_since: {
    type: Date,
    required: true,
  },
  subscriptions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription',
    default: [],
  }],
});

MembershipSchema.statics = {
  CreateMembership: MembershipServices.CreateMembership,
  GetMembership: MembershipServices.GetMembership,
  GetMembershipById: MembershipServices.GetMembershipById,
  GetMembershipByReferenceId: MembershipServices.GetMembershipByReferenceId,
};

module.exports = mongoose.model('Membership', MembershipSchema);
