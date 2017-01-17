require('dotenv').config({ silent: true });

var jwt    = require('jsonwebtoken');
var User = require('../models/user');
var StripeService = require("../services/stripe.services");
var async         = require("async");

var Account = require('../models/account');
var Membership = require('../models/membership');
var Plan = require('../models/plan');
var Subscription = require('../models/subscription');
var User = require('../models/user');

var SubscribeController = {

  CreateSubscription: function(req, res, next) {
    var subdomain = req.params.subdomain;
    var bull = null;
    var calf = null;
    var subscription = null;

    var current_user = req.current_user;
    var token = req.body.token;
    var plan_id = req.body.plan_id;
    var email_address = req.body.email_address;
    var password = req.body.password;
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;

    async.waterfall([
      function getBull(callback) {
        Account.findOne({ 'subdomain': subdomain}, function(err, account) {
          if(err) { return callback(err); }
          if(!account) { return callback(new Error("Bull not found")); }

          bull = account;

          callback(null);
        });
      },
      function getUser(callback) {
        if(current_user) {
          calf = current_user;

          callback(null);
        } else {
          User.findOne({ 'email_address': email_address}, function(err, user) {
            if(err) { return callback(err); }
            if(user) { return callback(new Error("User Exists")); }

            user = new User();

            user.email_address = email_address;
            user.password = password;
            user.first_name = first_name;
            user.last_name = last_name;
            user.roles.push("Calf");
            user.status = "Active";

            user.save(function(err, user) {
              if(err) { return callback(err); }

              calf = user;

              callback(null);
            });
          });
        }
      },
      function getMembership(callback) {
        Membership.GetMembership(calf, bull, function(err, membership) {
          if(err) { return callback(err); }

          if(!membership) {
            Membership.CreateMembership(calf, bull, null, function(err, membership) {
              callback(err, membership);
            });
          } else {
            callback(null, membership);
          }
        });
      },
      function getPlan(membership, callback) {
        Plan.findById(plan_id, function(err, plan) {
          if(err) { return callback(err); }
          if(!plan) { return callback(new Error("Plan Not Found")) }

          callback(err, plan, membership);
        })
      },
      function createSubscription(plan, membership, callback) {
        Subscription.SubscribeToPlan(membership, plan, null, function(err, subscription) {
          if(err) { return callback(err); }
          if(!subscription) { return callback(new Error("Unable to Subscribe to Plan")) }

          callback(err, subscription);
        });
      },
      function syncToStripe(new_subscription, callback) {
        subscription = new_subscription;

        callback(null)
      }
    ], function(err) {
      if(err) {
        res.status(403).send(err);
      } else {
        res.status(201).send(subscription);
      }
    });
  }
}

module.exports = SubscribeController
