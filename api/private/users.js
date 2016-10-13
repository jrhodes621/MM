require('dotenv').config({ silent: true });

var express    = require('express');        // call express
var router = express.Router();              // get an instance of the express Router
var mongoose   = require('mongoose');
var jwt    = require('jsonwebtoken');
var User = require('../../models/user');
var SubscriptionHelper = require('../../helpers/subscription_helper');

router.route('/connect_stripe')
  .post(function(req, res) {
    console.log("Connect Stripe");

    var user = req.user;

    console.log(req.body.stripe_connect);
    user.stripe_connect = req.body.stripe_connect

    user.save(function(err) {
      if(err)
        return res.status(400).send(err);

      res.status(200).json(user);
    });
  });

module.exports = router;
