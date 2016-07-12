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

    var user = req.user;

    if(!user.stripe_connect.access_token) {
      return res.send([]);
    }
    var stripe_api_key = user.stripe_connect.access_token;

    StripeManager.listMembers(stripe_api_key, function(err, members) {
      if(err) {
        console.log(err);

        return res.status(400).send({error: err});
      }

      console.log(members);

      res.send(members);
    });
  });
router.route('/:member_id')
  .get(function(req, res) {
    console.log("getting member");

    var user = req.user;

    if(!user.stripe_connect.access_token) {
      return res.send([]);
    }
    var stripe_api_key = user.stripe_connect.access_token;

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

    var user = req.user;

    if(!user.stripe_connect.access_token) {
      return res.send([]);
    }
    var stripe_api_key = user.stripe_connect.access_token;

    StripeManager.listCharges(stripe_api_key, req.params.member_id, function(err, charges) {
      if(err) {
        console.log(err);

        return res.status(400).send({error: err});
      }

      res.send(charges.data);
    });
  });

module.exports = router;
