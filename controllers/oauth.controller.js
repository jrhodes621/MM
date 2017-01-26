require('dotenv').config({ silent: true });

const User = require('../models/user');
const StripeOauthHelper = require('../services/stripe.oauth.services');

const OAuthController = {
  StripeConnectCallback: (req, res, next) => {
    const code = req.query.code;
    const userId = req.query.state;

    User.findById(userId, (err, user) => {
      if (err) { return next(err); }

      StripeOauthHelper.getAccessToken(process.env.STRIPE_CONNECT_SECRET_KEY, code,
      (err, response) => {
        if (err) { return next(err); }
        if (!response) { return next(err); }

        user.stripe_connect = JSON.parse(response);
        user.save((err) => {
          if (err) { return next(err); }

          return res.status(200).redirect('/dashboard/plans');
        });
      });
    });
  },
};

module.exports = OAuthController;
