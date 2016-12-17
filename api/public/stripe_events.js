require('dotenv').config({ silent: true });

var express    = require('express');        // call express
var router = express.Router();              // get an instance of the express Router
var mongoose   = require('mongoose');
var StripeEvent = require('../../models/stripe_event');
var ChargeSucceededProcessor = require('../../helpers/stripe_event_processors/charge_succeeded_processor');
var ChargeFailedProcessor = require('../../helpers/stripe_event_processors/charge_failed_processor');
var ChargeRefundedProcessor = require('../../helpers/stripe_event_processors/charge_refunded_processor');
var CustomerSubscriptionCreatedProcessor = require('../../helpers/stripe_event_processors/customer_subscription_created_processor');
var CustomerSubscriptionUpdatedProcessor = require('../../helpers/stripe_event_processors/customer_subscription_updated_processor');
var InvoiceSucceededProcessor = require('../../helpers/stripe_event_processors/invoice_succeeded_processor');
var InvoiceCreatedProcessor = require('../../helpers/stripe_event_processors/invoice_created_processor');

router.route('')
  .post(function(req, res, next) {
    // Retrieve the request's body and parse it as JSON
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
    stripe_event.raw_object = event_json;

    stripe_event.save(function(err) {
      if(err) { return next(err); }

      switch(stripe_event.type) {
        case "customer.subscription.created":
          CustomerSubscriptionCreatedProcessor.process(stripe_event, function(err, activity) {
            if(err) { return next(err) }

            res.send(200);
          });
          break;
        case "customer.subscription.updated":
          CustomerSubscriptionUpdatedProcessor.process(stripe_event, function(err, activity) {
            if(err) { return next(err) }

            res.send(200);
          });
          break;
        case "invoice.created":
          InvoiceCreatedProcessor.process(stripe_event, function(err, activity) {
            if(err) { return next(err) }

            res.send(200);
          });
          break;
        case "invoice.succeeded":
          InvoiceSucceededProcessor.process(stripe_event, function(err, activity) {
            if(err) { return next(err) }

            res.send(200);
          });
          break;
        case "charge.succeeded":
          ChargeSucceededProcessor.process(stripe_event, function(err, activity) {
            if(err) { return next(err) }

            res.send(200);
          });
          break;
        case "charge.failed":
          ChargeFailedProcessor.process(stripe_event, function(err, activity) {
            if(err) { return next(err) }

            res.send(200);
          });
          break;
        case "charge.refunded":
          ChargeRefundedProcessor.process(stripe_event, function(err, activity) {
            if(err) { return next(err) }

            res.send(200);
          });
          break;
        case "invoice.created":
          InvoiceCreatedProcessor.process(stripe_event, function(err, activity) {
            if(err) { return next(err) }

            res.send(200);
          });
          break;
        default:
          console.log("Don't know how to handle " + stripe_event.type);

          return next(new Error("Don't know how to handled " + stripe_event.type));
      }
    });
  });

module.exports = router;
