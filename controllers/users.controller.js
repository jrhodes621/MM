const Account = require('../models/account');
const Subscription = require('../models/subscription');
const User = require('../models/user');
const security = require('../security');
const StripeServices = require('../services/stripe.services');

const UsersController = {
  CreateUser: (req, res, next) => {
    const emailAddress = req.body.email_address;
    const password = req.body.password;
    const role = req.body.role;
    const companyName = req.body.company_name;
    const subdomain = companyName.replace(/\W/g, '').toLowerCase();
    const firstName = req.body.first_name;
    const lastName = req.body.last_name;

    User.findOne({ email_address: emailAddress }, (err, duplicateUser) => {
      if (err) { return next(err); }
      if (duplicateUser) { return next(new Error('Email Address is already in user')); }

      const user = new User();

      user.email_address = emailAddress;
      user.password = password;
      user.first_name = firstName;
      user.last_name = lastName;
      user.roles.push(role);
      user.status = 'Pending';

      const account = new Account();
      account.companyName = companyName;
      account.subdomain = subdomain;
      account.status = 'Pending';

      Subscription.GetMemberMooseFreePlan((err, plan) => {
        if (err) { return res.status(400).send(err); }
        if (!plan) {
          if (req.file) {
            User.UploadAvatar(user, req.file.path, (avatarImages) => {
              account.avatar = avatarImages;

              account.save((err) => {
                if (err) { return next(err); }

                user.account = account;
                user.save((err) => {
                  if (err) { return next(err); }

                  security.generate_token(user, process.env.SECRET, (err, token) => {
                    if (err) { return next(err); }

                    return res.status(201).json({ success: true, token, user_id: user._id });
                  });
                });
              });
            });
          } else {
            account.save((err) => {
              if (err) { return next(err); }

              user.account = account;
              user.save((err) => {
                if (err) { return next(err); }

                security.generate_token(user, process.env.SECRET, (err, token) => {
                  if (err) { return next(err); }

                  return res.status(201).json({ success: true, token, user_id: user._id });
                });
              });
            });
          }
        } else {
          const stripeApiKey = plan.user.account.stripe_connect.access_token;

          StripeServices.createCustomer(stripeApiKey, user, plan, (err, customer) => {
            customer.subscriptions.data.forEach((stripeSubscription) => {
              const subscription = new Subscription();
              subscription.plan = plan;
              subscription.reference_id = stripeSubscription.id;
              subscription.subscription_created_at = stripeSubscription.created_at;
              subscription.subscription_canceled_at = stripeSubscription.canceled_at;
              subscription.trial_start = stripeSubscription.trial_start;
              subscription.trial_end = stripeSubscription.trial_end;
              subscription.status = stripeSubscription.status;

              user.memberships.push({
                reference_id: customer.id,
                account_id: plan.user.account._id,
                company_name: plan.user.account.company_name,
                plan_names: [plan.name],
                member_since: customer.created,
                subscription,
              });
              user.status = 'Active';

              subscription.save((err) => {
                if (err) { return next(err); }

                plan.user.members.push(user);

                if (req.file) {
                  User.UploadAvatar(user, req.file.path, (avatarImages) => {
                    account.avatar = avatarImages;

                    account.save((err) => {
                      if (err) { return next(err); }

                      user.account = account;
                      user.save((err) => {
                        if (err) { return next(err); }

                        plan.user.save((err) => {
                          if (err) { return next(err); }

                          security.generate_token(user, process.env.SECRET, (err, token) => {
                            if (err) { return next(err); }

                            return res.status(201).json({ success: true, token, user_id: user._id});
                          });
                        })
                      });
                    });
                  })
                } else {
                  account.save((err) => {
                    if (err) { return next(err); }

                    user.account = account;
                    user.save((err) => {
                      if (err) { return next(err); }

                      plan.user.save((err) => {
                        if (err) { return next(err); }

                        const token = jwt.sign({ _id: user._id },
                          process.env.SECRET,
                          { expiresIn: 18000 });

                        return res.status(201).json({ success: true, token, user_id: user._id });
                      });
                    });
                  });
                }
              });
            });
          });
        }
      });
    });
  },
  UpdateUser: (req, res, next) => {
    User.findById(req.params.user_id, (err, user) => {
      if (err) { return next(err); }
      if (!user) { return next(new Error('User not found')); }

      user.first_name = req.body.first_name;
      user.last_name = req.body.last_name;
      user.email_address = req.body.email_address;

      if (req.body.password) {
        user.password = req.body.password;
      }

      if (req.file) {
        User.UploadAvatar(user, req.file.path, (avatarImages) => {
          user.avatar = avatarImages;

          user.save((err) => {
            if (err) { return next(err); }

            return res.status(200).json(user);
          });
        });
      } else {
        return res.status(200).json(user);
      }
    });
  },
};

module.exports = UsersController;
