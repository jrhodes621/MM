require('dotenv').config({ silent: true });

const Plan = require('../models/plan');
const Subscription = require('../models/subscription');
const StripeService = require('../services/stripe.services');

const SubscriptionsController = {
  CreateSubscription: (req, res, next) => {
    const customerId = req.body.customer_id;
    const planId = req.body.plan_id;

    StripeService.createSubscription(req.params.subscription_id, customerId, planId,
    (err, confirmation) => {
      if (err) { return next(err); }

      return res.status(201).send(confirmation);
    });
  },
  DeleteSubscription: (req, res, next) => {
    const user = req.user;
    const currentUser = req.currentUser;
    const stripeApiKey = currentUser.account.stripe_connect.access_token;

    Subscription.findById(req.params.subscription_id, (err, subscription) => {
      if (err) { return next(err); }
      if (!subscription) { return next(new Error('Subscription not found')); }

      StripeService.getSubscription(stripeApiKey, subscription.reference_id,
      (err, stripeSubscription) => {
        if (!stripeSubscription) {
          Membership.findOne({ user, account: currentUser.account }, (err, membership) => {
            if (!membership) { return next(new Error("Can't find a membership")); }

            membership.plan_names = [];
            membership.subscription = null;

            subscription.status = 'Cancelled';
            subscription.save((err) => {
              if (err) { return next(err); }

              user.save((err) => {
                if (err) { return next(err); }

                return res.sendStatus(200);
              });
            });
          });
        } else {
          StripeService.cancelSubscription(stripeApiKey, subscription.reference_id,
          (err, confirmation) => {
            if (err) { return next(err); }

            Membership.findOne({ user, account: currentUser.account }, (err, membership) => {
              if (!membership) { return next(new Error("Can't find a membership")); }

              membership.plan_names = [];

              subscription.status = 'Cancelled';
              subscription.save((err) => {
                if (err) { return next(err); }

                user.save((err) => {
                  if (err) { return next(err); }

                  return res.sendStatus(200);
                });
              });
            });
          });
        }
      });
    });
  },
  UpgradeSubscription: function(req, res, next) {
    const user = req.user;
    const currentUser = req.currentUser;
    const stripeApiKey = currentUser.account.stripe_connect.access_token;

    Subscription.findById(req.params.subscription_id, function(err, subscription) {
      if(err) { return next(err) }
      if(!subscription) { return next(new Error("Subscription not found")) }

      Plan.findById(req.body.plan_id, function(err, plan) {
        if(err) { return next(err) }
        if(!plan) { return next(new Error("Plan not found")) }

        StripeService.updateSubscription(stripeApiKey, subscription.reference_id, plan.reference_id, function(err, stripe_subscription) {
          if(err) { return next(err) }

          const new_subscription = new Subscription();
          new_subscription.plan = plan;
          new_subscription.reference_id = stripe_subscription.id;
          new_subscription.subscription_created_at = stripe_subscription.created_at;
          new_subscription.subscription_canceled_at = stripe_subscription.canceled_at;
          new_subscription.trial_start = stripe_subscription.trial_start;
          new_subscription.trial_end = stripe_subscription.trial_end;
          new_subscription.status = stripe_subscription.status;

          Membership.findOne({ "user": user, "account": currentUser.account }, function(err, membership) {
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
