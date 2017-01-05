var StripeManager = require('./stripe_manager');
var Membership = require('../models/membership');
var User = require('../models/user');
var PaymentCard = require('../models/payment_card');
var PaymentCardHelper      = require('./payment_card_helper');
var Subscription = require('../models/subscription');
var SourceHelper      = require('./source_helper');
var UserHelper   = require('./user_helper');
var async = require("async");

module.exports = {
  parse: function(bull, customer, stripe_subscription, plan, callback) {
    async.waterfall([
      function getUser(callback) {
        User.findOne({"email_address": customer.email}, callback);
      },
      function parseUser(user, callback) {
        if(!user) {
          user = new User();
          user.email_address = customer.email;
          user.password = "test123";
          user.status = "Active";
          user.memberships = [];

          user.save(function(err) {
            callback(err, user);
          });
        } else {
          callback(null, user);
        }
      }
    ], function(err, user) {
      callback(null, user);
    });
  }
}
