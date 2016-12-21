require('dotenv').config({ silent: true });

var express    = require('express');        // call express
var router = express.Router();              // get an instance of the express Router
var mongoose   = require('mongoose');
var StripeEvent = require('../../models/stripe_event');
var AccountHelper = require('../../helpers/account_helper');
var StripeEventProcessor = require('../../helpers/stripe_event_processor');

router.route('')
  .post(function(req, res, next) {
    // Retrieve the request's body and parse it as JSON
    var event_json = req.body;
    var account_id = event_json.user_id;
    var event_id = event_json.id;
    var event_type = event_json.type;
    var request_id = event_json.request;
    var livemode = event_json.livemode;
    var object_json = event_json.data.object;

    var stripe_event = new StripeEvent();

    stripe_event.event_id = event_id;
    stripe_event.type = event_type;
    stripe_event.request_id = request_id;
    stripe_event.livemode = livemode;
    stripe_event.raw_object = event_json;

    AccountHelper.getAccount(account_id, function(err, account) {
      if(err) { return next(err); }

      if(account) {
        stripe_event.account = account;
        stripe_event.save(function(err) {
          if(err) { return next(err); }

          StripeEventProcessor.processEvent(stripe_event, function(activity, callback) {
            if(!err) {
              stripe_event.processed = true;

              stripe_event.save(function(err) {
                console.log(err);

                res.send(200);
              });
            } else {
              console.log(err);

              res.send(200);
            }
          });
        });
      } else {
        stripe_event.save(function(err) {
          if(err) { return next(err); }

          res.send(200);
        });
      }
    });
});

module.exports = router;
