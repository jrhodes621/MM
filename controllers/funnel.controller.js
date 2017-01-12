require('dotenv').config({ silent: true });

var jwt    = require('jsonwebtoken');
var User = require('../models/user');
var randomstring = require("randomstring");

var FunnelController = {
  Step1: function(req, res, next) {
    var user = new User();
    var full_name = req.body.name;

    var name = full_name.split(" ");
    var first_name = name[0];
    var last_name = name[1];
    var email_address = "user+" + randomstring.generate() + "@membermoose.com";
    var password = "password";

    user.first_name = first_name;
    user.last_name = last_name;
    user.email_address = email_address;
    user.password = password;

    user.roles.push("Bull");

    user.save(function(err) {
      if(err)
        return res.status(400).send(err);

      var token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: 18000 });

      res.status(200).json({success: true, token: token, user: user});
    });
  },
  Step2: function(req, res, next) {
    var user = req.current_user;

    var account = new Account();

    var company_name = req.body.company_name;
    var subdomain = company_name.replace(/\W/g, '').toLowerCase();

    account.company_name = company_name;
    account.subdomain = subdomain;
    account.status = "Pending";

    account.save(function(err) {
      if(err)
        return res.status(400).send(err);

      SubscriptionHelper.getFreePlan(function(err, plan) {
        if(err)
          return res.status(400).send(err);

        SubscriptionHelper.subscribeToPlan(user, plan, function(err, subscription) {
          if(err)
            return res.status(400).send(err);

          account.subscription = subscription;

          user.account = account;
          user.save(function(err) {
            if(err)
              return res.status(400).send(err);

            res.status(200).json(user);
          });
        });
      });
    });
  },
  Step3: function(req, res, next) {
    var user = req.current_user;

    var email_address = req.body.email_address;
    var password = req.body.password;

    user.email_address = email_address;
    user.password = password;

    user.save(function(err) {
      if(err)
        return res.status(400).send(err);

      res.status(200).json(user);
    });
  }
}

module.exports = FunnelController
