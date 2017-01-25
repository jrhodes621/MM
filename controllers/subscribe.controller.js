require('dotenv').config({ silent: true });

const User = require('../models/user');
const async = require('async');
const Account = require('../models/account');
const Membership = require('../models/membership');
const Plan = require('../models/plan');
const Subscription = require('../models/subscription');

const SubscribeController = {

  CreateSubscription: (req, res, next) => {
    let bull = null;
    let calf = null;
    let subscription = null;

    const subdomain = req.params.subdomain;
    const currentUser = req.currentUser;
    const planId = req.body.plan_id;
    const emailAddress = req.body.email_address;
    const password = req.body.password;
    const firstName = req.body.first_name;
    const lastName = req.body.last_name;

    async.waterfall([
      function getBull(callback) {
        Account.findOne({ subdomain }, (err, account) => {
          if (err) { return next(err); }
          if (!account) { return next(new Error('Bull not found')); }

          bull = account;

          return callback(err);
        });
      },
      function getUser(callback) {
        if (currentUser) {
          calf = currentUser;

          callback(null);
        } else {
          User.findOne({ email_address: emailAddress }, (err, user) => {
            if (err) { return next(err); }
            if (user) { return next(new Error('User Exists')); }

            user = new User();

            user.email_address = emailAddress;
            user.password = password;
            user.first_name = firstName;
            user.last_name = lastName;
            user.roles.push('Calf');
            user.status = 'Active';

            user.save((err) => {
              if (err) { return next(err); }

              calf = user;

              return callback(null);
            });
          });
        }
      },
      function getMembership(callback) {
        Membership.GetMembership(calf, bull, (err, membership) => {
          if (err) { return next(err); }

          if (!membership) {
            Membership.CreateMembership(calf, bull, null, (err, membership) => {
              callback(err, membership);
            });
          } else {
            callback(null, membership);
          }
        });
      },
      function getPlan(membership, callback) {
        Plan.findById(planId, (err, plan) => {
          if (err) { return next(err); }
          if (!plan) { return next(new Error('Plan Not Found')); }

          callback(err, plan, membership);
        });
      },
      function createSubscription(plan, membership, callback) {
        Subscription.SubscribeToPlan(membership, plan, null, (err, subscription) => {
          if (err) { return next(err); }
          if (!subscription) { return next(new Error('Unable to Subscribe to Plan')); }

          callback(err, subscription);
        });
      },
      function syncToStripe(newSubscription, callback) {
        subscription = newSubscription;

        callback(null);
      },
    ], (err) => {
      if (err) {
        res.status(403).send(err);
      } else {
        res.status(201).send(subscription);
      }
    });
  },
};

module.exports = SubscribeController;
