var StripeManager = require('./stripe_manager');
var Membership = require('../models/membership');
var User = require('../models/user');
var PaymentCard = require('../models/payment_card');
var PaymentCardHelper      = require('./payment_card_helper');
var Subscription = require('../models/subscription');
var SourceHelper      = require('./source_helper');
var UserHelper   = require('./user_helper');
var Step = require('step');

var saveMembership = function(customer, stripe_subscription, memberUser, plan, callback) {
  var membership = new Membership();

  membership.reference_id = customer.id;
  membership.user = memberUser;
  membership.company_name = plan.user.account.company_name;
  membership.account = plan.user.account;
  membership.member_since = customer.created;

  var subscription = new Subscription();

  subscription.plan = plan;
  subscription.reference_id = stripe_subscription.id;
  subscription.subscription_created_at = stripe_subscription.created_at;
  subscription.subscription_canceled_at = stripe_subscription.canceled_at;
  subscription.trial_start = stripe_subscription.trial_start;
  subscription.trial_end = stripe_subscription.trial_end;
  subscription.status = stripe_subscription.status;
  subscription.membership = membership;

  subscription.save(function(err) {
    if(err) { throw err; }

    membership.subscriptions.push(subscription);
    membership.save(function(err) {
      console.log("Saving Subscription");
      if(err) { throw err; }

      memberUser.memberships.push(membership);

      callback(err, memberUser);
    });
  });
};

module.exports = {
  parse: function(customer, stripe_subscription, plan, callback) {
    Step(
      function getUser() {
        console.log("***Getting User: " + customer.email + '***');

        User.findOne({"email_address": customer.email}, this);
      },
      function parseUser(err, user) {
        if(err) { throw err; }

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
      function parseMemberUser(err, memberUser) {
        if(err) { throw err; }

        saveMembership(customer, stripe_subscription, memberUser, plan, this);
      },
      function parsePaymentCards(err, memberUser) {
        if(err) { throw err; }

        SourceHelper.parse(memberUser, customer, this);
      },
      function doCallback(err, memberUser) {
        if(err) { throw err; }

        callback(err, memberUser);
      }
    )
  }
}
