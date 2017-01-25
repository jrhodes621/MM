require('dotenv').config({ silent: true });

const Account = require('../models/account');
const StripeEvent = require('../models/stripe_event');
const StripeEventProcessor = require('../helpers/stripe_event_processor');

const StripeEventsController = {
  CreateStripeEvent: (req, res, next) => {
    // Retrieve the request's body and parse it as JSON
    const eventJson = req.body;
    const accountId = eventJson.user_id;
    const eventId = eventJson.id;
    const eventType = eventJson.type;
    const requestId = eventJson.request;
    const livemode = eventJson.livemode;

    const stripeEvent = new StripeEvent();

    stripeEvent.event_id = eventId;
    stripeEvent.type = eventType;
    stripeEvent.request_id = requestId;
    stripeEvent.livemode = livemode;
    stripeEvent.raw_object = eventJson;

    Account.findOne({ reference_id: accountId }, (err, account) => {
      if (err) { return next(err); }

      if (account) {
        stripeEvent.account = account;
        stripeEvent.save((err) => {
          if (err) { return next(err); }

          StripeEventProcessor.processEvent(eventJson, account, (err, activity) => {
            if (err) { return next(err); }

            stripeEvent.processed = true;
            stripeEvent.save((err) => {
              if (err) { return next(err); }

              return res.send(200);
            });
          });
        });
      } else {
        stripeEvent.save((err) => {
          if (err) { return next(err); }

          return res.send(200);
        });
      }
    });
  },
};

module.exports = StripeEventsController;
