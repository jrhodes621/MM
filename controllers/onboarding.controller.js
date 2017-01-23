var Account = require('../models/account');
var User = require('../models/user');
var StripeImportProcessor = require('../helpers/stripe_import_processor');
var Upload = require('s3-uploader');
var multer  = require('multer');
var jackrabbit = require('jackrabbit');

var OnboardingController = {
  ConnectStripe: function(req, res, next) {
    var account = req.current_user.account;

    account.stripe_connect = req.body.stripe_connect;
    account.reference_id = account.stripe_connect.stripe_user_id;

    account.save(function(err) {
      if(err) { return next(err); }

      //start job to import plans
      var rabbit = jackrabbit('amqp://localhost');
      rabbit.default().publish({ account_id: account._id }, { key: 'stripe_import_queue' });

      res.status(200).json(req.current_user)
    });
  }
}

module.exports = OnboardingController
