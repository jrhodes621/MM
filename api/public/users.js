require('dotenv').config({ silent: true });

var express    = require('express');        // call express
var router = express.Router();              // get an instance of the express Router
var mongoose   = require('mongoose');
var jwt    = require('jsonwebtoken');
var User = require('../../models/user');
var UserHelper = require('../../helpers/user_helper');
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

    var user = new User();
    var role = req.body.role;
    var company_name = req.body.company_name;
    var subdomain = company_name.replace(/\W/g, '').toLowerCase();

    user.email_address = req.body.email_address;
    user.password = req.body.password;
    user.first_name = req.body.first_name;
    user.last_name = req.body.last_name;
    user.company_name = company_name;
    user.roles.push(role);
    user.subdomain = subdomain;
    user.status = "Pending";

    SubscriptionHelper.getFreePlan(function(err, plan) {
      if(err) {
        console.log(err);
        return res.status(400).send(err);
      }
      if(!plan) {
        console.log("Membermoose Free Plan Not Found, so we'll create a user with no subscriptions!");

        if(req.file) {

          UserHelper.uploadAvatar(user, req.file.path, function(avatar_images) {
            user.avatar = avatar_images;

            user.save(user, function(err) {
              if(err) { return next(err); }

              var token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: 18000 });

              res.status(200).json({success: true, token: token, user_id: user._id});
            });
          });
        } else {
          user.save(function(err) {
            if(err) { return next(err); }

            var token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: 18000 });

            res.status(200).json({success: true, token: token, user_id: user._id});
          });
        }
      } else {
        var stripe_api_key = plan.user.stripe_connect.access_token;
        StripeManager.createCustomer(stripe_api_key, user, plan, function(err, customer) {
          var member = new Member();
          member.email_address = customer.email;
          member.reference_id = customer.id;
          member.member_since = customer.created;

          user.member = member;
          plan.user.members.push(member);

          SubscriptionHelper.subscribeToPlan(user, plan, function(err, subscription) {
            if(err) {
              console.log(err);

              return res.status(400).send(err);
            }

            user.member.subscriptions.push(subscription);

            if(req.file) {

              UserHelper.uploadAvatar(user, req.file.path, function(avatar_images) {
                user.avatar = avatar_images;

                user.save(function(err) {
                  if(err) { return next(err); }

                  plan.user.save(function(err) {
                    if(err) { return next(err); }

                    var token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: 18000 });

                    res.status(200).json({success: true, token: token, user_id: user._id});
                  })
                });
              });
            } else {
              UserHelper.saveUser(user, function(err) {
                if(err) { return next(err); }

                plan.user.save(function(err) {
                  if(err) { return next(err); }

                  var token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: 18000 });

                  res.status(200).json({success: true, token: token, user_id: user._id});
                })
              });
            }
          });
        });
      }
    })
  });

module.exports = router;
