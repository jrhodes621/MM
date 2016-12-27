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
var MemberHelper = require('../../helpers/member_helper');
var ReferencePlanHelper = require('../../helpers/reference_plan_helper');
var SubscriptionHelper = require('../../helpers/subscription_helper');
var StripeImportHelper = require('../../helpers/stripe_import_helper');
var UserHelper = require('../../helpers/user_helper');
var Upload = require('s3-uploader');
var multer  = require('multer');
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

function logImportActivity(user, plan, callback) {
  var message_calf = "Successfully imported " + plan.name + " from Stripe.";
  var message_bull = "Successfully imported " + plan.name + " from Stripe.";
  var received_at = new Date();

  ActivityHelper.createActivity(user, null, plan, "import_success", message_calf, message_bull, "Stripe", received_at, function(err, activity) {
    callback(err, this);
  });
}
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
        Activity.find({ "calf": user})
        .populate('bull')
        .populate('calf')
        .populate('plan')
        .exec(function(err, activities) {
          if(err) { return next(err) }

          res.status(200).send(activities);
        });
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
    var numberOfPlans = plansToImport.length;

    if(numberOfPlans == 0) {
      return res.status(200).json(user);
    }
    plansToImport.forEach(function(planToImport) {
      Step(
        function getPlan() {
          Plan.findOne({ "reference_id": planToImport, "user": current_user })
          .populate('user')
          .populate({
            path: 'user',
            populate: [{
              path: 'account'
            }]
          })
          .exec(this);
        },
        function parsePlan(err, plan) {
          if(err) { throw err; }

          if(!plan) {
            ReferencePlanHelper.parse(current_user, planToImport, this);
          } else {
            return plan;
          }
        },
        function getMembersFromStripe(err, plan) {
          if(err) { throw err; }

          StripeImportHelper.importMembersForPlan(current_user, plan, this);
        },
        function saveMembers(err, plan, members) {
          if(err) { throw err; }

          MemberHelper.saveMembers(plan, members, this);
        },
        function getChargesForMembers(err, plan, members) {
          if(err) { throw err; }

          StripeImportHelper.importChargesForMembers(current_user, plan, members, this);
        },
        function savePlan(err, plan, users) {
          if(err) { throw err; }

          plan.save(this);
        },
        // function updateReferencePlan(err, plan, users) {
        //   if(err) { throw err; }
        //
        //   planToImport.imported = true;
        //   planToImport.save(function(err) {
        //     return plan
        //   });
        // },
        function createActivity(err, plan) {
          logImportActivity(current_user, plan, this);
        },
        function doCallBack(err, plan) {
          if(err) { throw err; }

          numberOfPlans -= 1;

          if(numberOfPlans == 0) {
            current_user.save(function(err) {
              if(err) { throw err; }

              res.status(200).json(current_user);
            });
          }
        }
      );
    });
  })
module.exports = router;
