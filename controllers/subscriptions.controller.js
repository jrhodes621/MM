require('dotenv').config({ silent: true });

var jwt    = require('jsonwebtoken');
var Plan = require('../models/plan');
var User = require('../models/user');
var Subscription = require('../models/subscription');
var StripeService = require("../services/stripe.services");

var SubscriptionsController = {
  CreateSubscription: function(req, res, next) {
    var customer_id = req.body.customer_id;
    var plan_id = req.body.plan_id;

    StripeService.createSubscription(req.params.subscription_id, customer_id, plan_id, function(err, confirmation) {
      if(err) {
        console.log(err);

        return res.status(400).send({error: err});
      }

      res.status(201).send(confirmation);
    });
  },
  DeleteSubscription: function(req, res, next) {
    var user = req.user;
    var current_user = req.current_user;
    var stripe_api_key = current_user.account.stripe_connect.access_token;

    Subscription.findById(req.params.subscription_id, function(err, subscription) {
      if(err) { return next(err) }
      if(!subscription) { return next(new Error("Subscription not found")) }

      StripeService.getSubscription(stripe_api_key, subscription.reference_id, function(err, stripe_subscription){
        if(!stripe_subscription) {
          Membership.findOne({ "user": user, "account": current_user.account }, function(err, membership) {
            if(!membership) { return next(new Error("Can't find a membership")) }

            membership.plan_names = [];
            membership.subscription = null;

            subscription.status = "Cancelled";
            subscription.save(function(err) {
              if(err) { return next(err) }

              user.save(function(err) {
                if(err) { return next(err); }

                res.sendStatus(200);
              });
            })
          });
        } else {
          StripeService.cancelSubscription(stripe_api_key, subscription.reference_id, function(err, confirmation) {
            if(err) { return next(err); }

            Membership.findOne({ "user": user, "account": current_user.account }, function(err, membership) {
              if(!membership) { return next(new Error("Can't find a membership")) }

              membership.plan_names = [];

              subscription.status = "Cancelled";
              subscription.save(function(err) {
                if(err) { return next(err) }

                user.save(function(err) {
                  if(err) { return next(err); }

                  res.sendStatus(200);
                });
              })
            });
          });
        }
      });
    });
  },
  UpgradeSubscription: function(req, res, next) {
    var user = req.user;
    var current_user = req.current_user;
    var stripe_api_key = current_user.account.stripe_connect.access_token;

    Subscription.findById(req.params.subscription_id, function(err, subscription) {
      if(err) { return next(err) }
      if(!subscription) { return next(new Error("Subscription not found")) }

      Plan.findById(req.body.plan_id, function(err, plan) {
        if(err) { return next(err) }
        if(!plan) { return next(new Error("Plan not found")) }

        StripeService.updateSubscription(stripe_api_key, subscription.reference_id, plan.reference_id, function(err, stripe_subscription) {
          if(err) { return next(err) }

          var new_subscription = new Subscription();
          new_subscription.plan = plan;
          new_subscription.reference_id = stripe_subscription.id;
          new_subscription.subscription_created_at = stripe_subscription.created_at;
          new_subscription.subscription_canceled_at = stripe_subscription.canceled_at;
          new_subscription.trial_start = stripe_subscription.trial_start;
          new_subscription.trial_end = stripe_subscription.trial_end;
          new_subscription.status = stripe_subscription.status;

          Membership.findOne({ "user": user, "account": current_user.account }, function(err, membership) {
            if(!membership) { return next(new Error("Can't find a membership")) }

            membership.plan_names = [];
            membership.plan_names.push(plan.name);
            membership.subscription = new_subscription
          });
          subscription.status = "Cancelled";
          subscription.save(function(err) {
            if(err) { return next(err) }

            new_subscription.save(function(err) {
              if(err) { return next(err); }

              user.save(function(err) {
                if(err) { return next(err); }

                res.status(200).send(new_subscription);
              });
            });
          })

        });
      });
    });
  }
}

module.exports = SubscriptionsController
