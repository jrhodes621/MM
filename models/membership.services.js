var MembershipServices = {
  GetMembership: function(user, account, callback) {
    Membership.findOne({"account": account, "user": user }, function(err, membership) {
      callback(err, membership);
    });
  },
  GetMembershipByReferenceId: function(reference_id, callback) {
    Membership.findOne({ "reference_id": reference_id})
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
