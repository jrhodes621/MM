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
      if(err) {
        console.log(err);

        return res.status(400).send({error: err});
      }

      res.send(plan);
    });
  })
  .put(function(req, res) {
    console.log("updating a plan");

    var user = req.current_user;

    if(!user.account.stripe_connect.access_token) {
      return res.send([]);
    }
    var stripe_api_key = user.account.stripe_connect.access_token;
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
