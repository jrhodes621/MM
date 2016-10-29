var StripeManager = require('./stripe_manager');
var User = require('../models/user');
var Subscription = require('../models/subscription');
var Step = require('step');

module.exports = {
  parse: function(customer, stripe_subscription, plan, callback) {
    Step(
      function getUser() {
        User.findOne({"email_address": customer.email}, this);
      },
      function parseUser(err, user) {
        if(!user) {
          user = new User();
          user.email_address = customer.email;
          user.password = "test123";
          user.status = "Active";
          user.memberships = [];
        }

        return user;
      },
      function parseMemberUser(err, memberUser) {
        var subscription = new Subscription();

        subscription.plan = plan;
        subscription.reference_id = stripe_subscription.id;
        subscription.subscription_created_at = stripe_subscription.created_at;
        subscription.subscription_canceled_at = stripe_subscription.canceled_at;
        subscription.trial_start = stripe_subscription.trial_start;
        subscription.trial_end = stripe_subscription.trial_end;
        subscription.status = stripe_subscription.status;

        memberUser.memberships = [];
        memberUser.memberships.push({
          reference_id: customer.id,
          company_name: plan.user.account.company_name,
          account_id: plan.user.account._id,
          plan_names: [plan.name],
          member_since: customer.created,
          subscription: subscription
        });

        return memberUser
      },
      function addMember(err, memberUser) {
        callback(err, memberUser);
      }
    )
  }
}
