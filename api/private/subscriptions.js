require('dotenv').config({ silent: true });

var express    = require('express');        // call express
var router = express.Router();              // get an instance of the express Router
var mongoose   = require('mongoose');
var jwt    = require('jsonwebtoken');
var User = require('../../models/user');
var Subscription = require('../../models/subscription');
var StripeManager = require("../../helpers/stripe_manager");

router.route('')
  .post(function(req, res) {
    var customer_id = req.body.customer_id;
    var plan_id = req.body.plan_id;

    StripeManager.createSubscription(req.params.subscription_id, customer_id, plan_id, function(err, confirmation) {
      if(err) {
        console.log(err);

        return res.status(400).send({error: err});
      }

      res.status(202).send(confirmation);
    });
  });
router.route('/:subscription_id')
  .delete(function(req, res, next) {
    var user = req.current_user;
    var stripe_api_key = user.account.stripe_connect.access_token;

    Subscription.findById(req.params.subscription_id, function(err, subscription) {
      if(err) { return next(err) }
      if(!subscription) { return next(new Error("Subscription not found")) }

      StripeManager.cancelSubscription(stripe_api_key, subscription.reference_id, function(err, confirmation) {
        if(err) {
          console.log(err);

          return next(err);
        }
        subcription.status = "Cancelled";
        subscription.save(function(err) {
          if(err) { return next(err) }

          res.sendStatus(200);
        })
      });
    });
  });

module.exports = router;
