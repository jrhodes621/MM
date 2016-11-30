require('dotenv').config({ silent: true });

var express    = require('express');        // call express
var router = express.Router();              // get an instance of the express Router
var mongoose   = require('mongoose');
var jwt    = require('jsonwebtoken');
var Plan = require('../../models/plan');
var User = require('../../models/user');
var StripeManager = require("../../helpers/stripe_manager");

router.route('')
  .get(function(req, res) {
    console.log("getting plan");

    var user = req.current_user;
    if(!user.account.stripe_connect.access_token) {
      return res.send([]);
    }
    var stripe_api_key = user.account.stripe_connect.access_token;

    StripeManager.getPlan(stripe_api_key, req.params.plan_id, function(err, plan) {
      if(err) { return next(err); }

      res.send(plan);
    });
  })
  .put(function(req, res, next) {
    console.log("updating a plan");

    var current_user = req.current_user;
    var plan = req.plan;


    plan.name = req.body.name;
    plan.description = req.body.description;
    plan.terms_of_service = req.body.terms_of_service;

    if(!current_user.account.stripe_connect.access_token) {
      plan.save(function(err) {
        if(err) { return next(err); }

        res.status(200).send(plan);
      });
    }
    var stripe_api_key = current_user.account.stripe_connect.access_token;
    console.log(stripe_api_key);

    console.log(plan);
    plan.save(function(err) {
      if(err) { return next(err); }

      StripeManager.updatePlan(stripe_api_key, plan, function(err, plan) {
        if(err) { return next(err); }


        res.status(200).send(plan);
      });
    });
  });
router.route('/members')
  .get(function(req, res, next) {
      console.log("getting members");

      var current_user = req.current_user;
      var plan = req.plan;

      Plan.findById(plan._id)
      .populate('members')
      .exec(function(err, plan) {
        if(err) { return next(err); }

        res.status(200).send(plan.members);
      });
    });

module.exports = router;
