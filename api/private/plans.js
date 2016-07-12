require('dotenv').config({ silent: true });

var express    = require('express');        // call express
var router = express.Router();              // get an instance of the express Router
var mongoose   = require('mongoose');
var jwt    = require('jsonwebtoken');
var User = require('../../models/user');
var StripeManager = require("../../helpers/stripe_manager");

router.route('')
  .get(function(req, res) {
    console.log("getting plans");

    var user = req.user;

    if(!user.stripe_connect || !user.stripe_connect.access_token) {
      return res.send([]);
    }
    var stripe_api_key = user.stripe_connect.access_token;

    StripeManager.listPlans(stripe_api_key, function(err, plans) {
      if(err) {
        console.log(err);

        return res.status(400).send({error: err});
      }

      res.send(plans);
    });
  })
  .post(function(req, res) {
    console.log("creating a plan");

    var user = req.user;

    if(!user.stripe_connect.access_token) {
      return res.send([]);
    }
    var stripe_api_key = user.stripe_connect.access_token;
    var plan = req.body;

    StripeManager.createPlan(stripe_api_key, plan, function(err, plan) {
      if(err) {
        console.log(err);

        return res.status(400).send({error: err});
      }

      console.log(plan);

      res.status(201).send(plan);
    });
  });
  router.route('/:plan_id')
    .get(function(req, res) {
      console.log("getting plan");

      var user = req.user;

      if(!user.stripe_connect.access_token) {
        return res.send([]);
      }
      var stripe_api_key = user.stripe_connect.access_token;

      StripeManager.getPlan(stripe_api_key, req.params.plan_id, function(err, plan) {
        if(err) {
          console.log(err);

          return res.status(400).send({error: err});
        }

        res.send(plan);
      });
    })
    .put(function(req, res) {
      console.log("updating a plan");

      var user = req.user;

      if(!user.stripe_connect.access_token) {
        return res.send([]);
      }
      var stripe_api_key = user.stripe_connect.access_token;
      var plan = req.body;

      StripeManager.updatePlan(stripe_api_key, plan, function(err, plan) {
        if(err) {
          console.log(err);

          return res.status(400).send({error: err});
        }

        console.log(plan);

        res.status(200).send(plan);
      });
    });

module.exports = router;
