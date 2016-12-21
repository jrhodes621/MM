require('dotenv').config({ silent: true });

var express    = require('express');        // call express
var router = express.Router();              // get an instance of the express Router
var mongoose   = require('mongoose');
var StripeEvent = require('../models/stripe_event');
var AccountHelper = require('./account_helper');
var ChargeSucceededProcessor = require('./stripe_event_processors/charge_succeeded_processor');
var ChargeFailedProcessor = require('./stripe_event_processors/charge_failed_processor');
var ChargeRefundedProcessor = require('./stripe_event_processors/charge_refunded_processor');
var ChargeDisputeProcessor = require('./stripe_event_processors/charge_dispute_processor');
var CustomerSubscriptionCreatedProcessor = require('./stripe_event_processors/customer_subscription_created_processor');
var CustomerSubscriptionUpdatedProcessor = require('./stripe_event_processors/customer_subscription_updated_processor');
var InvoiceSucceededProcessor = require('./stripe_event_processors/invoice_succeeded_processor');

module.exports = {
  processEvent: function(stripe_event, callback) {
    switch(stripe_event.type) {
      case "customer.subscription.created":
        CustomerSubscriptionCreatedProcessor.process(stripe_event, function(err, activity) {
          callback(err, activity);
        });
        break;
      case "customer.subscription.updated":
        CustomerSubscriptionUpdatedProcessor.process(stripe_event, function(err, activity) {
          callback(err, activity);
        });
        break;
      case "customer.subscription.deleted":
        CustomerSubscriptionUpdatedProcessor.process(stripe_event, function(err, activity) {
          callback(err, activity);
        });
        break;
      case "customer.subscription.trial_will_end":
        CustomerSubscriptionUpdatedProcessor.process(stripe_event, function(err, activity) {
          callback(err, activity);
        });
        break;
      case "charge.dispute.created":
        CustomerDisputeProcessor.processCreated(stripe_event, function(err, activity) {
          callback(err, activity);
        });
        break;
      case "charge.dispute.closed":
        break;
      case "charge.dispute.updated":
        break;
      case "charge.dispute.funds_withdrawn":
        break;
      case "charge.dispute.funds_reinstated":
        break;
      case "coupon.created":
        break;
      case "coupon.deleteCard":
        break;
      case "coupon.updated":
        break;
      case "customer.created":
        break;
      case "customer.delete":
        break;
      case "customer.updated":
        break;
      case "customer.discount.created":
        break;
      case "customer.discount.deleted":
        break;
      case "customer.discount.updated":
        break;
      case "customer.source.created":
        break;
      case "customer.source.deleted":
        break;
      case "customer.source.updated":
        break;
      case "plan.created":
        break;
      case "plan.deleted":
        break;
      case "plan.updated":
        break;
      case "source.canceled":
        break;
      case "source.chargeable":
        break;
      case "source.failed":
        break;
      case "source.transaction.created":
        break;
      case "invoice.created":
        InvoiceCreatedProcessor.process(stripe_event, function(err, activity) {
          callback(err, activity);
        });
        break;

      case "invoice.payment_succeeded":
        InvoiceSucceededProcessor.process(stripe_event, function(err, activity) {
          callback(err, activity);
        });
        break;
        //invoice.payment_failed
        //invoice.sent
        //invoice.updated
      case "customer.invoice_item.created":
        break;
      case "customer.invoice_item.deleted":
        break;
      case "customer.invoice_item.updated":
        break;
      case "charge.succeeded":
        ChargeSucceededProcessor.process(stripe_event, function(err, activity) {
          callback(err, activity);
        });
        break;
      case "charge.failed":
        ChargeFailedProcessor.process(stripe_event, function(err, activity) {
          callback(err, activity);
        });
        break;
      case "charge.refunded":
        ChargeRefundedProcessor.process(stripe_event, function(err, activity) {
          callback(err, activity);
        });
        break;
      case "invoice.created":
        InvoiceCreatedProcessor.process(stripe_event, function(err, activity) {
          callback(err, activity);
        });
        break;
      default:
        var error = new Error("Don't know how to handled " + stripe_event.type);

        callback(null, error);
    }
  }
}
