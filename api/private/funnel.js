require('dotenv').config({ silent: true });

var express    = require('express');        // call express
var router = express.Router();              // get an instance of the express Router
var mongoose   = require('mongoose');
var jwt    = require('jsonwebtoken');
var User = require('../../models/user');
var Account = require('../../models/account');
var SubscriptionHelper = require('../../helpers/subscription_helper');

router.route('/step2')
  .post(function(req, res) {
    var user = req.user;

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
  });
router.route('/step3')
  .post(function(req, res) {
    var user = req.user;

    var email_address = req.body.email_address;
    var password = req.body.password;

    user.email_address = email_address;
    user.password = password;

    user.save(function(err) {
      if(err)
        return res.status(400).send(err);

      res.status(200).json(user);
    });
  });

module.exports = router;
