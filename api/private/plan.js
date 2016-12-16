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
var Activity = require('../../models/activity');

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
  .put(upload.single('file'), function(req, res, next) {
    console.log("updating a plan");

    var current_user = req.current_user;
    var plan = req.plan;

    plan.name = req.body.name;
    plan.one_time_amount = req.body.one_time_amount;
    plan.description = req.body.description;
    plan.trial_period_days = req.body.trial_period_days;
    plan.features = req.body.features;
    plan.terms_of_service = req.body.terms_of_service;

    if(!current_user.account.stripe_connect.access_token) {
      plan.save(function(err) {
        if(err) { return next(err); }

        if(req.file) {
          PlanHelper.uploadAvatar(plan, req.file.path, function(avatar_images) {
            console.log(avatar_images);
            plan.avatar = avatar_images;

            plan.save(function(err) {
              if(err) { return next(err); }

              res.status(200).send(plan)
            })
          });
        } else {
          res.status(200).send(plan);
        }
      });
    }
    var stripe_api_key = current_user.account.stripe_connect.access_token;
    console.log(stripe_api_key);

    console.log(plan);
    plan.save(function(err) {
      if(err) { return next(err); }

      StripeManager.updatePlan(stripe_api_key, plan, function(err, stripe_plan) {
        if(err) { return next(err); }

        if(req.file) {
          PlanHelper.uploadAvatar(plan, req.file.path, function(avatar_images) {
            console.log(avatar_images);
            plan.avatar = avatar_images;

            plan.save(function(err) {
              if(err) { return next(err); }

              res.status(200).send(plan)
            });
          });
        } else {
          res.status(200).send(plan);
        }
      });
    });
  })
  .delete(function(req, res) {
    var current_user = req.current_user;
    var plan = req.plan;
    plan.archive = true;

    if(current_user.account.stripe_connect.access_token) {
      var stripe_api_key = current_user.account.stripe_connect.access_token;

      StripeManager.deletePlan(stripe_api_key, plan, function(err, confirmation) {
        if(err) { return next(err); }
        console.log(confirmation);

        plan.save(function(err) {
          if(err) { return next(err); }

          res.sendStatus(202);
        });
      });
    } else {
      plan.save(function(err) {
        if(err) { return next(err); }

        res.sendStatus(202);
      });
    }
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
router.route('/activities')
  .get(function(req, res, next) {
      console.log("getting activity for plan");

      var current_user = req.current_user;
      var plan = req.plan;

      Activity.find({ "plan": plan})
      .populate('bull')
      .populate('calf')
      .populate('plan')
      .exec(function(err, activities) {
        if(err) { return next(err) }

        res.status(200).send(activities);
      })
  });
module.exports = router;
