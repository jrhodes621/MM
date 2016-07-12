require('dotenv').config({ silent: true });

var express    = require('express');        // call express
var router = express.Router();              // get an instance of the express Router
var mongoose   = require('mongoose');
var jwt    = require('jsonwebtoken');
var User = require('../../models/user');
var StripeOauthHelper = require("../../helpers/stripe_oauth_helper");

router.route('/stripe_connect/callback')
  .get(function(req, res) {
    var code = req.query.code;
    var userId = req.query.state;

    User.findById(userId)
    .exec(function(err, user) {
      if(err)
        return res.status(400).send({error: "User Not Found."});

        StripeOauthHelper.getAccessToken(process.env.STRIPE_CONNECT_SECRET_KEY, code, function(err, response) {
          if(err) {
            return res.status(400).send({error: err});
          }
          user.stripe_connect = JSON.parse(response);

          user.save(function(err) {
            if(err)
              return res.status(400).send({error: err});

            res.status(200).redirect('http://localhost:3000/dashboard/plans');
          });
        });
    });
  });

module.exports = router;
