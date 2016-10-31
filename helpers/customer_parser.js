var StripeManager = require('./stripe_manager');
var User = require('../models/user');
var PaymentCard = require('../models/payment_card');
var Subscription = require('../models/subscription');
var SourceHelper      = require('./source_helper');
var Step = require('step');

module.exports = {
  parse: function(customer, stripe_subscription, plan, callback) {
    Step(
      function getUser() {
        console.log("***Getting User: " + customer.email + '***');

        User.findOne({"email_address": customer.email}, this);
      },
      function parseUser(err, user) {
        if(err) { console.log(err); }

        console.log("***Parsing User: " + customer.email + '***');

        if(!user) {
          user = new User();
          user.email_address = customer.email;
          user.password = "test123";
          user.status = "Active";
          user.memberships = [];
        }

        return user;
      },
      function parseSources(err, user) {
        if(err) { console.log(err); }

        console.log("***Parsing Sources for User");

        SourceHelper.parse(user, customer, this);
      },
      function parseMemberUser(err, memberUser) {
        if(err) { console.log(err); }

        console.log("***Parsing Member User ***");

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
        if(err) { console.log(err); }

        console.log("*** Add Member**");

        callback(err, memberUser);
      }
    )
  }
}
