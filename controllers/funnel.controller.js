require('dotenv').config({ silent: true });

const jwt = require('jsonwebtoken');
const Account = require('../models/account');
const Subscription = require('../models/subscription');
const User = require('../models/user');
const randomstring = require('randomstring');

const FunnelController = {
  Step1: (req, res, next) => {
    const user = new User();
    const fullName = req.body.name;

    const name = fullName.split(' ');
    const firstName = name[0];
    const lastName = name[1];
    const emailAddress = 'user+' + randomstring.generate() + '@membermoose.com';
    const password = 'password';

    user.first_name = firstName;
    user.last_name = lastName;
    user.email_address = emailAddress;
    user.password = password;

    user.roles.push('Bull');

    user.save((err) => {
      if (err) { next(err); }

      const token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: 18000 });

      return res.status(200).json({ success: true, token, user });
    });
  },
  Step2: (req, res, next) => {
    const user = req.currentUser;
    const account = new Account();

    const companyName = req.body.company_name;
    const subdomain = company_name.replace(/\W/g, '').toLowerCase();

    account.company_name = companyName;
    account.subdomain = subdomain;
    account.status = 'Pending';

    account.save((err) => {
      if (err) { return next(err); }

      Subscription.getFreePlan((err, plan) => {
        if (err) { return next(err); }

        Subscription.subscribeToPlan(user, plan, (err, subscription) => {
          if (err) { return next(err); }

          account.subscription = subscription;

          user.account = account;
          user.save((err) => {
            if (err) { return next(err); }

            return res.status(200).json(user);
          });
        });
      });
    });
  },
  Step3: (req, res, next) => {
    const user = req.currentUser;

    const emailAddress = req.body.email_address;
    const password = req.body.password;

    user.email_address = emailAddress;
    user.password = password;

    user.save((err) => {
      if (err) { return next(err); }

      return res.status(200).json(user);
    });
  },
};

module.exports = FunnelController;
