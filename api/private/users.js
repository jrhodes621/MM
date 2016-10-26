require('dotenv').config({ silent: true });

var express    = require('express');        // call express
var router = express.Router();              // get an instance of the express Router
var mongoose   = require('mongoose');
var jwt    = require('jsonwebtoken');
var User = require('../../models/user');
var PaymentCard = require('../../models/payment_card');
var Plan = require('../../models/plan');
var SubscriptionHelper = require('../../helpers/subscription_helper');
var StripeImportHelper = require('../../helpers/stripe_import_helper');
var UserHelper = require('../../helpers/user_helper');
var Upload = require('s3-uploader');
var multer  = require('multer');

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
        user.save(function(err) {
          if(err) { return next(err); }

          res.status(200).json(user);
        });
      }
    })
  });
router.route('/connect_stripe')
  .post(function(req, res, next) {
    console.log("Connect Stripe");

    var user = req.current_user;
    user.account.stripe_connect = req.body.stripe_connect;

    console.log(req.body.stripe_connect);
    StripeImportHelper.importFromStripe(user, function(errors, plans) {
      numberOfPlans = plans.length;
      plans.forEach(function(plan) {

        plan.save(function(err) {
          numberOfPlans = numberOfPlans - 1;

          if(err) {
            console.log(err);
          } else {
            user.plans.push(plan);

            if(numberOfPlans == 0) {
              user.account.save(function(err) {
                if(err) { return next(err); }
                user.save(function(err) {
                  if(err) { return next(err) };

                  res.status(200).json(user);
                });
              });
            }
          }
        });
      })
    });
  });
router.route('/import_plans')
  .post(function(req, res) {
    console.log("Import Members");

    var user = req.current_user;
    var plansToImport = req.body.plans;
    console.log(plansToImport);

    var numberOfPlans = plansToImport.length;
    plansToImport.forEach(function(planToImport) {
      Plan.findById(planToImport, function(err, plan) {
        numberOfPlans = numberOfPlans - 1;
        console.log(numberOfPlans);
        StripeImportHelper.importMembersFromPlan(user, plan, function(errors, members) {
          console.log(members);
          var numberOfMembers = members.length;

          members.forEach(function(member) {
            member.save(function(err) {
              numberOfMembers = numberOfMembers - 1;
              console.log(numberOfMembers);
              if(err) {
                console.log(err);
                if(numberOfMembers == 0  && numberOfPlans == 0) {
                  user.save(function(err) {
                    if(err) {
                      console.log(err)

                      return res.status(400).send(err);
                    }

                    res.status(200).json(user);
                  });
                }
              } else {
                member.memberships.forEach(function(membership) {
                  membership.subscription.save(function(err) {
                    if(err) {
                      console.log(err)
                    }
                    user.members.push(member);

                    if(numberOfMembers == 0  && numberOfPlans == 0) {
                      user.save(function(err) {
                        if(err) {
                          console.log(err)

                          return res.status(400).send(err);
                        }

                        res.status(200).json(user);
                      });
                    }
                  })
                });
              }
            });
          });
        });
      });
    });
  })
module.exports = router;
