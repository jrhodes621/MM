require('dotenv').config({ silent: true });

var express    = require('express');        // call express
var router = express.Router();              // get an instance of the express Router
var mongoose   = require('mongoose');
var StripeEvent = require('../../models/stripe_event');

router.route('')
  .post(function(req, res, next) {
    // Retrieve the request's body and parse it as JSON
    console.log(req.body);
    var event_json = req.body
    var event_id = event_json.id
    var event_type = event_json.type;
    var request_id = event_json.request;
    var livemode = event_json.livemode;
    var object_json = event_json.data.object;

    var stripe_event = new StripeEvent();

    stripe_event.event_id = event_id;
    stripe_event.type = event_type;
    stripe_event.request_id = request_id;
    stripe_event.livemode = livemode;
    stripe_event.raw_object = object_json;

    stripe_event.save(function(err) {
      if(err) { return next(err); }

      // Do something with event_json
      //var event_types = ['charge_failed', 'charge_refunded', 'charge_succeeded']
      res.send(200);
    });
  });

module.exports = router;
