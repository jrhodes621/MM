var Membership = require('../models/membership');

var MembershipServices = {
  CreateMembership: function(calf, bull, reference_id, callback) {
    var membership = new this();

    membership.reference_id = reference_id;
    membership.user = calf;
    membership.account = bull;
    membership.member_since = new Date();
    
    membership.save(function(err) {
      callback(err, membership);
    });
  },
  GetMembership: function(user, account, callback) {
    this.findOne({"account": account, "user": user }, function(err, membership) {
      callback(err, membership);
    });
  },
  GetMembershipById: function(membership_id, callback) {
    this.findOne(membership_id)
    .populate('user')
    .populate('account')
    .populate({
        path: 'subscriptions',
        populate: {
          path: 'plan'
        }
      }
    )
    .exec(function(err, membership) {
      callback(err, membership);
    });
  },
  GetMembershipByReferenceId: function(reference_id, callback) {
    this.findOne({ "reference_id": reference_id})
    .populate('user')
    .populate('account')
    .populate({
        path: 'subscriptions',
        populate: {
          path: 'plan'
        }
      }
    )
    .exec(function(err, membership) {
      callback(err, membership);
    });
  }
}

module.exports = MembershipServices
