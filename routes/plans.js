var express = require('express');
var router = express.Router();
var User = require('../models/user');
var StripeManager = require("../helpers/stripe_manager");

router.get('/', function(req, res, next) {
    User.findOne({ 'subdomain': req.subdomain}, function(err, user) {
      if(err)
        return res.status(404).send(err);

      if(!user.stripe_connect || !user.stripe_connect.access_token) {
        return res.render('public/plans', { user: user, plans: [] });
      }
      var stripe_api_key = user.stripe_connect.access_token;

      StripeManager.listPlans(stripe_api_key, function(err, plans) {
        if(err) {
          console.log(err);

          return res.status(400).send({error: err});
        }
        console.log(plans);

        res.render('public/plans', { user: user, plans: plans.data });
      });
    });
  });

module.exports = router;
