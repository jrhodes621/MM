var StripeManager = require('./stripe_manager');
var User = require('../models/user');
var Membership = require('../models/membership');
var MembershipHelper  = require('../helpers/membership_helper');
var PaymentCard = require('../models/payment_card');
var Subscription = require('../models/subscription');
var SourceHelper      = require('./source_helper');
var UserHelper   = require('./user_helper');
var Step = require('step');

module.exports = {
  parse: function(bull, customer, stripe_subscription, plan, callback) {
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
      function addMembership(err, user) {
        if(err) { console.log(err); }

        MembershipHelper.parse(bull, user, customer, stripe_subscription, plan, this);
      },
      function doCallback(err, memberUser) {
        if(err) { console.log(err); }

        console.log("*** Add Member**");

        callback(err, memberUser);
      }
    )
  }
}
