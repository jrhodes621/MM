var Membership = require('../models/membership');
var Subscription = require('../models/subscription');
var Step = require('step');

module.exports = {
  parse: function(bull, user, stripe_customer, stripe_subscription, plan, callback) {
    Step(
      function addSubscription() {
        console.log("***adding subscriptiion");

        var subscription = new Subscription();

        subscription.plan = plan;
        subscription.reference_id = stripe_subscription.id;
        subscription.subscription_created_at = stripe_subscription.created_at;
        subscription.subscription_canceled_at = stripe_subscription.canceled_at;
        subscription.trial_start = stripe_subscription.trial_start;
        subscription.trial_end = stripe_subscription.trial_end;
        subscription.status = stripe_subscription.status;

        subscription.save(function(err) {
          if (err) throw err;

          console.log("Subscription saved");

          console.log("***creating membership");

          var membership = new Membership();

          membership.reference_id = stripe_customer.id;
          membership.user = user;
          membership.company_name = bull.account.company_name;
          membership.account = bull.account;
          membership.member_since = stripe_customer.created;
          membership.subscriptions.push(subscription);

          membership.save(function(err) {
            if (err) throw err;

            user.memberships.push(membership);

            callback(err, user)
          });
        });
      }
    )
  },
  getMembership: function(user, account, callback) {
    console.log("getting membership for " + account_id);

    Membership.findOne({"account": account }, function(err, membership) {
      callback(err, membership);
    });
  },
  getMembershipByReference: function(reference_id, callback) {
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
  },
  saveMemberships: function(memberships, callback) {
    var numberOfMemberships = memberships.length;

    if(numberOfMemberships == 0) {
      callback(null, []);
    }
    memberships.forEach(function(membership) {
      numberOfMemberships -= 1;
      console.log(membership);

      var numberOfSubscriptions = membership.subscriptions.length;

      membership.subscriptions.forEach(function(subscription) {
        subscription.save(function(err) {
          numberOfSubscriptions -= 1;

          if(err) { console.log(err); }

          if(numberOfMemberships == 0  && numberOfSubscriptions == 0) {
            callback(err, memberships)
          }
        });
      });
    });
  }
}
