const jackrabbit = require('jackrabbit');
const config = require('../lib/config');

const OnboardingController = {
  ConnectStripe: (req, res, next) => {
    const account = req.currentUser.account;

    account.stripe_connect = req.body.stripe_connect;
    account.reference_id = account.stripe_connect.stripe_user_id;
    account.save((err) => {
      if (err) { return next(err); }

      const rabbit = jackrabbit(config.rabbit_url);
      rabbit.default().publish({ account_id: account._id }, { key: 'stripe_import_queue' });

      return res.status(200).json(req.currentUser);
    });
  },
};

module.exports = OnboardingController
