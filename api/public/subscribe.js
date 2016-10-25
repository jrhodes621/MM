require('dotenv').config({ silent: true });

var express    = require('express');        // call express
var router = express.Router();              // get an instance of the express Router
var mongoose   = require('mongoose');
var jwt    = require('jsonwebtoken');
var User = require('../../models/user');
var StripeManager = require("../../helpers/stripe_manager");

router.route('')
  .post(function(req, res) {
    console.log("Subscribing User to Plan");

    var token = req.body.token;
    var plan_id = req.body.plan_id;
    var email = req.body.email_address;

    console.log(req.subdomain);
    User.findOne({ 'subdomain': req.subdomain}, function(err, bull) {
      if(err)
        return res.status(400).send(err);

      if(!bull)
        return res.status(404).send("Bull not found");

      if(!bull.stripe_connect || !bull.account.stripe_connect.access_token) {
        return res.status(400).send("The bull must connect their stripe api key.");
      }

      var stripe_api_key = bull.account.stripe_connect.access_token;

      User.findOne({ 'email_address': email}, function(err, user) {
        if(user)
          return res.status(400).send("User Exists");

        user = new User();
        var role = "Calf";

        user.email_address = req.body.email_address;
        user.password = req.body.password;
        user.first_name = req.body.first_name;
        user.last_name = req.body.last_name;
        user.roles.push(role);
        user.status = "Active";

        user.save(function(err) {
          if(err)
            return res.status(400).send(err);

          StripeManager.createSubscription(stripe_api_key, token, plan_id, email, function(err, confirmation) {
            if(err) {
              console.log(err);

              return res.status(400).send({error: err});
            }

            res.status(202).send(confirmation);
          });
        });
      });
    });
  });

module.exports = router;
