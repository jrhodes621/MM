var User = require('../models/user');
var StripeImportProcessor = require('../../helpers/stripe_import_processor');
var Upload = require('s3-uploader');
var multer  = require('multer');
var async = require("async");

var OnboardingController = {
  ConnectStripe: function(req, res, next) {
    var user = req.current_user;
    user.account.stripe_connect = req.body.stripe_connect;

    StripeImportProcessor.importFromStripe(user, function(errors, plans) {
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
  }
  ImportPlans: function(req, res, next) {
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
  }
}

module.exports = OnboardingController
