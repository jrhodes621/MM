require('dotenv').config({ silent: true });

var Account = require('../models/account');
var StripeEvent = require('../models/stripe_event');
var StripeEventProcessor = require('../helpers/stripe_event_processor');

var StripeEventsController = {
  CreateStripeEvent: function(req, res, next) {
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

    Account.findOne({ "reference_id": account_id }, function(err, account) {
      if(err) { return next(err); }

      if(account) {
        stripe_event.account = account;
        stripe_event.save(function(err) {
          if(err) { return next(err); }

          StripeEventProcessor.processEvent(event_json, account, function(err, activity) {
            if(err) { return next(err); }

            stripe_event.processed = true;
            stripe_event.save(function(err) {
              if(err) { return next(err); }

              return res.send(200);
            });
          });
        });
      } else {
        stripe_event.save(function(err) {
          if(err) { return next(err); }

          res.send(200);
        });
      }
    });
  }
}

module.exports = StripeEventsController
