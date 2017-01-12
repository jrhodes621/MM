var express = require('express');
var router = express.Router();
var User = require('../models/user');
var StripeServices = require('../services/stripe.services');

router.get('/', function(req, res, next) {
    User.findOne({ 'subdomain': req.subdomain}, function(err, user) {
      if(err)
        return res.status(404).send(err);

      if(!user.account.stripe_connect || !user.account.stripe_connect.access_token) {
        return res.render('public/plans', { user: user, plans: [] });
      }
      var stripe_api_key = user.account.stripe_connect.access_token;

      StripeServices.listPlans(stripe_api_key, function(err, plans) {
        if(err) {
          console.log(err);

          return res.status(400).send({error: err});
        }
        console.log(plans);

        res.render('public/plans', { user: user, plans: plans.data });
      });
    });
  });
router.get('/subscribe/:plan_id', function(req, res) {
    var plan_id = req.params.plan_id;
    console.log("the plan is " + plan_id);

    User.findOne({ 'subdomain': req.subdomain}, function(err, user) {
      if(err)
        return res.status(404).send(err);

      if(!user.account.stripe_connect || !user.account.stripe_connect.access_token) {
        return res.render('public/plans', { user: user, plans: [] });
      }
      var stripe_api_key = user.account.stripe_connect.access_token;

      StripeServices.getPlan(stripe_api_key, plan_id, function(err, plan) {
        if(err) {
          console.log(err);

          return res.status(400).send({error: err});
        }
        console.log(plan);

        res.render('public/subscribe', { user: user, plan: plan });
      });
    });
  });

module.exports = router;
