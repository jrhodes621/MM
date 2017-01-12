require('dotenv').config({ silent: true });

var User = require('../models/user');
var StripeOauthHelper = require("../services/stripe.oauth.services");

var OAuthController = {
  StripeConnectCallback: function(req, res, next) {
    var code = req.query.code;
    var userId = req.query.state;

    User.findById(userId,function(err, user) {
      if(err) { return res.status(400).send({error: "User Not Found."}); }

      StripeOauthHelper.getAccessToken(process.env.STRIPE_CONNECT_SECRET_KEY, code, function(err, response) {
        if(err) { return res.status(400).send({error: err}); }

        user.stripe_connect = JSON.parse(response);
        user.save(function(err) {
          if(err) { return res.status(400).send({error: err}); }

          res.status(200).redirect('/dashboard/plans');
        });
      });
    });
  }
}

module.exports = OAuthController
