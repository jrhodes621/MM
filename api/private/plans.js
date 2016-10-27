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
    console.log("getting plans");

    var user = req.current_user;
    var page_size = 10;
    var page = req.query.page || 1;
    var offset = (page-1)*page_size;

    Plan.paginate({ "user": user._id }, { offset: offset, limit: page_size }, function(err, result) {
      if(err) { return next(err) };

      res.json({ results: result.docs, total: result.total, limit: result.limit, offset: result.offset });
    });
  })
  .post(function(req, res, next) {
    console.log("creating a plan");

    var user = req.current_user;

    var plan = new Plan();
    plan.user = user._id;
    plan.name = req.body.name;
    plan.amount = req.body.amount;
    plan.interval = req.body.interval;
    plan.interval_count = req.body.interval_count;
    plan.statement_descriptor = req.body.statement_descriptor;
    plan.trial_period_days = req.body.trial_period_days;
    plan.statement_description = req.body.statement_description;

    if(user.account.stripe_connect) {
      var stripe_api_key = user.account.stripe_connect.access_token;

      StripeManager.createPlan(stripe_api_key, plan, function(err, stripe_plan) {
        if(err) { return next(err); }

        plan.reference_id = stripe_plan.id;
        plan.save(function(err) {
          if(err) { return next(err); }

          user.plans.push(plan);

          user.save(function(err) {
            if(err) { return next(err); }

            res.status(201).send(plan);
          });
        });
      });
    } else {
      plan.save(function(err) {
        if(err) { return next(err); }

        user.plans.push(plan);

        user.save(function(err) {
          if(err) { return next(err); }

          res.status(201).send(plan);
        });
      });
    }
  });
  router.route('/:plan_id')
    .get(function(req, res) {
      console.log("getting plan");

      var user = req.current_user;
      console.log(user);
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

module.exports = router;
