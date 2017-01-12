var Membership            = require('../../models/membership');
var User                  = require('../../models/user');
var PaymentCard           = require('../../models/payment_card');
var Subscription          = require('../../models/subscription');
var async                 = require("async");

function parse(bull, stripe_customer, callback) {
  var result = null;
  var user = null;

  async.waterfall([
    function getUser(callback) {
      User.findOne({ "email_address": stripe_customer.email }, function(err, user) {
        callback(err, user);
      });
    },
    function parseUser(user, callback) {
      if(!user) {
        user = new User();

        user.password = "test123"
      }

      user.email_address = stripe_customer.email
      if(user.roles.indexOf("Calf") === - 1) {
        user.roles.push("Calf")
      }
      user.reference_id = stripe_customer.id
      user.status = "Active"

      user.save(function(err) {
        callback(err, user);
      });
    },
    function getMembership(user, callback) {
      Membership.findOne({ user: user, account: bull }, function(err, membership) {
        callback(err, user, membership);
      });
    },
    function parseMembership(user, membership, callback) {
      if(!membership) {
        membership = new Membership();
      }
      membership.reference_id = stripe_customer.id;
      membership.user = user;
      membership.company_name = bull.company_name;
      membership.account = bull;
      membership.member_since = stripe_customer.created;

      membership.save(function(err) {
        if (user.memberships.indexOf(membership._id) === -1) {
            user.memberships.push(membership);
        }
        result = user;

        callback(err, user, membership);
      });
    },
    function parseSources(user, membership, callback) {
      var stripe_sources = stripe_customer.sources.data;

      async.eachSeries(stripe_sources, function(stripe_source, callback) {
        CustomerCardParser.parse(stripe_source, function(err, user, payment_card) {
          callback(err, payment_card);
        });
      }, function(err, payment_cards) {
        result = user;

        callback(err, user, membership);
      });
    },
    function parseSubscriptions(user, membership, callback) {
      var stripe_subscriptions = stripe_customer.subscriptions.data;

      async.eachSeries(stripe_subscriptions, function(stripe_subscription) {
        CustomerSubscriptionParser.parse(bull, stripe_subscription, function(err, subscription) {
          callback(err, subscription);
        });
      }, function(err, subscriptions) {
        result = user;

        callback(err);
      });
    }
  ], function(err) {
    result.save(function(err) {
      callback(err, result);
    })
  });
}

module.exports = {
  parse
}
