require('dotenv').config({ silent: true });

var express    = require('express');        // call express
var router = express.Router();              // get an instance of the express Router
var mongoose   = require('mongoose');
var jwt    = require('jsonwebtoken');
var User = require('../../models/user');
var StripeManager = require("../../helpers/stripe_manager");

router.route('')
  .get(function(req, res) {
    console.log("getting members");

    var user = req.current_user;

    res.send(user.members);
  })
  .post(function(req, res, next) {
    console.log("adding member");
    var current_user = req.current_user;

    var user = new User();
    user.email_address = req.body.email_address;
    user.password = "test123";
    user.first_name = req.body.first_name;
    user.last_name = req.body.last_name;
    user.status = "Pending";
    user.roles = ['Calf'];

    user.save(function(err) {
      if(err) { return next(err); }

      current_user.members.push(user);
      current_user.save(function(err) {
        if(err) { return next(err); }

        res.status(201).send(user);
      });
    });
  });
router.route('/:member_id')
  .get(function(req, res) {
    console.log("getting member");

    var user = req.current_user;

    if(!user.account.stripe_connect.access_token) {
      return res.send([]);
    }
    var stripe_api_key = user.account.stripe_connect.access_token;

    StripeManager.getMember(stripe_api_key, req.params.member_id, function(err, member) {
      if(err) {
        console.log(err);

        return res.status(400).send({error: err});
      }

      res.send(member);
    });
  });
router.route('/:member_id/charges')
  .get(function(req, res) {
    console.log("getting charges");

    var user = req.current_user;

    if(!user.account.stripe_connect.access_token) {
      return res.send([]);
    }
    var stripe_api_key = user.account.stripe_connect.access_token;

    StripeManager.listCharges(stripe_api_key, req.params.member_id, function(err, charges) {
      if(err) {
        console.log(err);

        return res.status(400).send({error: err});
      }

      res.send(charges.data);
    });
  });

module.exports = router;
