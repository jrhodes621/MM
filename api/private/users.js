require('dotenv').config({ silent: true });

var express    = require('express');        // call express
var router = express.Router();              // get an instance of the express Router
var mongoose   = require('mongoose');
var jwt    = require('jsonwebtoken');
var Activity = require('../../models/activity');
var Charge = require('../../models/charge');
var User = require('../../models/user');
var PaymentCard = require('../../models/payment_card');
var Plan = require('../../models/plan');
var ActivityHelper = require('../../helpers/activity_helper');
var ReferencePlanHelper = require('../../helpers/reference_plan_helper');
var SubscriptionHelper = require('../../helpers/subscription_helper');
var StripeImportHelper = require('../../helpers/stripe_import_helper');
var UserHelper = require('../../helpers/user_helper');
var Upload = require('s3-uploader');
var multer  = require('multer');
var async = require("async");
var Step = require('step');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null,  file.originalname );
  }
});
var upload = multer({ storage: storage  });

router.route('/:user_id')
  .put(upload.single('file'), function(req, res, next) {
    console.log("updating a user");
    console.log(req.params.user_id);

    User.findById(req.params.user_id, function(err, user) {
      if(err) { return next(err); }

      if(!user) { return next(new Error("User not found")); }

      user.first_name = req.body.first_name;
      user.last_name = req.body.last_name;
      user.email_address = req.body.email_address;
      if(req.body.password) {
        user.password = req.body.password;
      }

      if(req.file) {

        UserHelper.uploadAvatar(user, req.file.path, function(avatar_images) {
          user.avatar = avatar_images;

          user.save(function(err) {
            if(err) { return next(err); }

            res.status(200).json(user);
          });
        });
      } else {
        UserHelper.uploadInitialsAvatar(user, function(err, user) {
          user.save(function(err) {
            if(err) { return next(err); }

            res.status(200).json(user);
          });
        });
      }
    })
  });
router.route('/:user_id/devices')
  .post(function(req, res, next) {
    console.log("adding a device");

    var current_user = req.current_user;

    var device = {
      device_type: req.body.device_type,
      device_identifier: req.body.device_identifier,
      token: req.body.device_token
    }

    UserHelper.addDevice(current_user, device, function(err) {
      if(err) { return next(err); }

      res.status(201).send(current_user);
    });
  });
router.route('/:user_id/activities')
  .get(function(req, res, next) {
      console.log("getting activity for plan");

      var current_user = req.current_user;

      User.findById(req.params.user_id, function(err, user) {
        if(err) { return next(err); }
        Activity.aggregate([
          { $match: { "calf": user._id } },
          { $group: {
               _id: { year: { $year : "$createdAt" }, month: { $month : "$createdAt" },day: { $dayOfMonth : "$createdAt" } },
               date_group: { $first : '$createdAt' },
              activities: { $push: '$$ROOT'}
          } },
          { $project: {
              _id: 0,
              date_group: 1,
              activities: 1
            }
          }
        ])
        // .populate('bull')
        // .populate('calf')
        // .populate('plan')
        .exec(function(err, activities) {
          if(err) { return next(err) }

          res.status(200).send(activities);
        })
      });
    });

router.route('/connect_stripe')
  .post(function(req, res, next) {
    console.log("Connect Stripe");

    var user = req.current_user;
    user.account.stripe_connect = req.body.stripe_connect;

    StripeImportHelper.importFromStripe(user, function(errors, plans) {
      user.account.reference_id = user.account.stripe_connect.stripe_user_id;
      user.account.reference_plans = plans;

      user.account.save(function(err) {
        if(err) { return next(err); }
        user.save(function(err) {
          if(err) { return next(err) };

          res.status(200).json(user);
        });
      });
    });
  });
router.route('/import_plans')
  .post(function(req, res) {
    console.log("Import Members");

    var current_user = req.current_user;
    var plansToImport = req.body.plans;

    async.eachSeries(plansToImport, function(planToImport, callback) {
      async.waterfall([
        function getPlan(callback) {
          console.log("***Getting Plan*** " + planToImport);

          Plan.findOne({ "reference_id": planToImport, "user": current_user })
          .populate('user')
          .populate({
            path: 'user',
            populate: [{
              path: 'account'
            }]
          })
          .exec(function(err, plan) {
            callback(err, plan);
          });
        },
        function parsePlan(plan, callback) {
          if(!plan) {
            ReferencePlanHelper.parse(current_user, planToImport, function(err, plan) {
              if(err) { callback(err) }

              current_user.plans.push(plan);

              current_user.save(function(err) {
                callback(err, plan);
              });
            });
          } else {
            callback(null, plan);
          }
        },
        function getMembersFromStripe(plan, callback) {
          StripeImportHelper.importMembersForPlan(current_user, plan, function(err, members) {
            console.log("Imported " + members.length + " members.");

            callback(err, plan, members);
          });
        },
        function getChargesForMembers(plan, members, callback) {
          StripeImportHelper.importChargesForMembers(current_user, members, function(err, charges) {
            console.log("Imported " + charges.length + " charges.");

            callback(err, plan);
          });
        },
        function savePlan(plan, callback) {
          plan.save(function(err) {
            callback(err, plan);
          });
        },
        // function updateReferencePlan(plan, callback) {
        //   planToImport.imported = true;
        //   planToImport.save(function(err) {
        //     callback(err, plan);
        //   });
        // },
        function createActivity(plan, callback) {
          var message_calf = "Successfully imported " + plan.name + " from Stripe.";
          var message_bull = "Successfully imported " + plan.name + " from Stripe.";
          var received_at = new Date();

          ActivityHelper.createActivity(current_user, null, plan, "import_success", message_calf, message_bull, "Stripe", received_at, function(err, activity) {
            callback(err);
          });
        }
      ], function() {
        current_user.save(function(err) {
          callback(err);
        });
      })
    }, function(err) {
      if(err) {
        console.log(err);

        res.status(500).json(err);
      } else {
        res.status(200).json(current_user);
      }
    });
  })
module.exports = router;
