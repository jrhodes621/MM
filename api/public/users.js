require('dotenv').config({ silent: true });

var express    = require('express');        // call express
var router = express.Router();              // get an instance of the express Router
var mongoose   = require('mongoose');
var jwt    = require('jsonwebtoken');
var Account = require('../../models/account');
var User = require('../../models/user');
var UserHelper = require('../../helpers/user_helper');
var Subscription = require('../../models/subscription');
var SubscriptionHelper = require('../../helpers/subscription_helper');
var StripeManager = require('../../helpers/stripe_manager')
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

router.route('/')
  .post(upload.single('file'), function(req, res, next) {
    console.log("Create new user");
    var email_address = req.body.email_address;

    User.findOne({email_address : email_address}, function (err, user) {
      if(err) { return next(err) }
      if(user) { return next(new Error("Email Address is already in user")) }

      var user = new User();
      var role = req.body.role;
      var company_name = req.body.company_name;
      var subdomain = company_name.replace(/\W/g, '').toLowerCase();

      user.email_address = email_address;
      user.password = req.body.password;
      user.first_name = req.body.first_name;
      user.last_name = req.body.last_name;
      user.roles.push(role);
      user.status = "Pending";

      var account = new Account();
      account.company_name = company_name;
      account.subdomain = subdomain;
      account.status = "Pending"

      SubscriptionHelper.getFreePlan(function(err, plan) {
        if(err) {
          console.log(err);
          return res.status(400).send(err);
        }
        if(!plan) {
          console.log("Membermoose Free Plan Not Found, so we'll create a user with no subscriptions!");

          if(req.file) {
            UserHelper.uploadAvatar(user, req.file.path, function(avatar_images) {
              account.avatar = avatar_images;

              account.save(function(err) {
                if(err) { return next(err); }

                user.account = account;
                user.save(function(err) {
                  if(err) { return next(err); }

                  var token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: 18000 });

                  res.status(200).json({success: true, token: token, user_id: user._id});
                });
              });
            });
          } else {
            account.save(function(err) {
              if(err) { return next(err); }

              user.account = account;
              user.save(function(err) {
                if(err) { return next(err); }

                var token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: 18000 });

                res.status(200).json({success: true, token: token, user_id: user._id});
              });
            });
          }
        } else {
          var stripe_api_key = plan.user.stripe_connect.access_token;
          StripeManager.createCustomer(stripe_api_key, user, plan, function(err, customer) {

            var numberOfSubscriptions = customer.subscriptions.data.length;
            customer.subscriptions.data.forEach(function(stripe_subscription) {
              var subscription = new Subscription();
              subscription.plan = plan;
              subscription.reference_id = stripe_subscription.id;
              subscription.subscription_created_at = stripe_subscription.created_at;
              subscription.subscription_canceled_at = stripe_subscription.canceled_at;
              subscription.trial_start = stripe_subscription.trial_start;
              subscription.trial_end = stripe_subscription.trial_end;
              subscription.status = stripe_subscription.status;

              user.memberships.push({
                reference_id: customer.id,
                company_name: plan.user.company_name,
                plan_names: [plan.name],
                member_since: customer.created,
                subscription: subscription
              })
              user.status = "Active";

              subscription.save(function(err) {
                if(err) { return next(err); }

                plan.user.members.push(user);

                if(req.file) {
                  UserHelper.uploadAvatar(user, req.file.path, function(avatar_images) {
                    account.avatar = avatar_images;

                    account.save(function(err) {
                      if(err) { return next(err); }

                      user.account = account;
                      user.save(function(err) {
                        if(err) { return next(err); }

                        plan.user.save(function(err) {
                          if(err) { return next(err); }

                          var token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: 18000 });

                          res.status(200).json({success: true, token: token, user_id: user._id});
                        })
                      });
                    });
                  })
                } else {
                  account.sav(function(err){
                    if(err) { return next(err); }

                    user.account = account;
                    user.save(function(err) {
                      if(err) { return next(err); }

                      plan.user.save(function(err) {
                        if(err) { return next(err); }

                        var token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: 18000 });

                        res.status(200).json({success: true, token: token, user_id: user._id});
                      })
                    });
                  });
                }
              });
            });
          });
        }
      })
    });
  });

module.exports = router;
