require('dotenv').config({ silent: true });

var express    = require('express');        // call express
var router = express.Router();              // get an instance of the express Router
var mongoose   = require('mongoose');
var jwt    = require('jsonwebtoken');
var Plan = require('../../models/plan');
var User = require('../../models/user');
var StripeManager = require("../../helpers/stripe_manager");
var Upload = require('s3-uploader');
var multer  = require('multer');
var PlanHelper = require('../../helpers/plan_helper');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null,  file.originalname );
  }
});
var upload = multer({ storage: storage  });

router.route('')
  .get(function(req, res) {
    console.log("getting plans");

    var current_user = req.current_user;
    var page_size = 100;
    var page = req.query.page || 1;
    var offset = (page-1)*page_size;

    Plan.paginate({ "user": current_user._id, "archive": false }, { offset: offset, limit: page_size, sort: { name: 'asc'} }, function(err, result) {
      if(err) { return next(err) };

      res.json({ results: result.docs, total: result.total, limit: result.limit, offset: result.offset });
    });
  })
  .post(upload.single('file'), function(req, res, next) {
    console.log("creating a plan");

    var user = req.current_user;

    var plan = new Plan();
    plan.user = user._id;
    plan.name = req.body.name;
    plan.description = req.body.description;
    plan.features = req.body.features;
    plan.amount = req.body.amount;
    plan.interval = req.body.interval;
    plan.interval_count = req.body.interval_count;
    plan.statement_descriptor = req.body.statement_descriptor;
    plan.trial_period_days = req.body.trial_period_days;
    plan.statement_description = req.body.statement_description;
    plan.terms_of_service = req.body.terms_of_service;

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

            if(req.file) {
              PlanHelper.uploadAvatar(plan, req.file.path, function(avatar_images) {
                console.log(avatar_images);
                plan.avatar = avatar_images;

                plan.save(function(err) {
                  if(err) { return next(err); }

                  res.status(201).json(plan);
                });
              });
            } else {
              res.status(201).json(plan);
            }
          });
        });
      });
    } else {
      plan.save(function(err) {
        if(err) { return next(err); }

        user.plans.push(plan);

        user.save(function(err) {
          if(err) { return next(err); }

          if(req.file) {
            PlanHelper.uploadAvatar(plan, req.file.path, function(avatar_images) {
              console.log(avatar_images);
              plan.avatar = avatar_images;

              plan.save(function(err) {
                if(err) { return next(err); }

                res.status(201).json(plan);
              });
            });
          } else {
            res.status(201).json(plan);
          }
        });
      });
    }
  });

module.exports = router;
