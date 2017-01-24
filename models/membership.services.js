const MembershipServices = {
  CreateMembership: (calf, bull, referenceId, callback) => {
    const membership = new this();

    membership.reference_id = referenceId;
    membership.user = calf;
    membership.account = bull;
    membership.member_since = new Date();

    membership.save((err) => {
      callback(err, membership);
    });
  },
  GetMembership: (user, account, callback) => {
    this.findOne({ account: account, user: user }, callback);
  },
  GetMembershipById: (membershipId, callback) => {
    this.findOne(membershipId)
    .populate('user')
    .populate('account')
    .populate({
      path: 'subscriptions',
      populate: {
        path: 'plan',
      },
    })
    .exec(callback);
  },
  GetMembershipByReferenceId: (referenceId, callback) => {
    this.findOne({ reference_id: referenceId })
    .populate('user')
    .populate('account')
    .populate({
      path: 'subscriptions',
      populate: {
        path: 'plan',
      },
    })
    .exec(callback);
  },
};

module.exports = MembershipServices;
