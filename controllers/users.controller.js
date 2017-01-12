var User = require('../models/user');

var UsersController = {
  CreateUser: function(req, res, next) {
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
        console.log(plan);
        if(!plan) {
          console.log("Membermoose Free Plan Not Found, so we'll create a user with no subscriptions!");

          if(req.file) {
            User.UploadAvatar(user, req.file.path, function(avatar_images) {
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
          console.log(plan);
          var stripe_api_key = plan.user.account.stripe_connect.access_token;
          StripeServices.createCustomer(stripe_api_key, user, plan, function(err, customer) {

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
                account_id: plan.user.account._id,
                company_name: plan.user.account.company_name,
                plan_names: [plan.name],
                member_since: customer.created,
                subscription: subscription
              })
              user.status = "Active";

              subscription.save(function(err) {
                if(err) { return next(err); }

                plan.user.members.push(user);

                if(req.file) {
                  User.UploadAvatar(user, req.file.path, function(avatar_images) {
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
                  account.save(function(err){
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
  },
  UpdateUser: function(req, res, next) {
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
        User.UploadAvatar(user, req.file.path, function(avatar_images) {
          user.avatar = avatar_images;

          user.save(function(err) {
            if(err) { return next(err); }

            res.status(200).json(user);
          });
        });
      } else {
        Usser.UploadInitialsAvatar(user, function(err, user) {
          user.save(function(err) {
            if(err) { return next(err); }

            res.status(200).json(user);
          });
        });
      }
    });
  }
}

module.exports = UsersController
