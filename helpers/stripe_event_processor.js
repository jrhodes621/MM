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
var CouponProcessor = require('./stripe_event_processors/coupon_processor');
var CustomerProcessor = require('./stripe_event_processors/customer_processor');
var CustomerDiscountProcessor = require('./stripe_event_processors/customer_discount_processor');
var CustomerSourceProcessor = require('./stripe_event_processors/customer_source_processor');
var CustomerSubscriptionCreatedProcessor = require('./stripe_event_processors/customer_subscription_created_processor');
var CustomerSubscriptionUpdatedProcessor = require('./stripe_event_processors/customer_subscription_updated_processor');
var InvoiceCreatedProcessor = require('./stripe_event_processors/invoice_created_processor');
var InvoiceSucceededProcessor = require('./stripe_event_processors/invoice_succeeded_processor');
var PlanProcessor = require('./stripe_event_processors/plan_processor');
var SourceProcessor = require('./stripe_event_processors/source_processor');

module.exports = {
  processEvent: function(stripe_event, bull, callback) {
    console.log("Processing Stripe Event: " + stripe_event.type);

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
        CustomerDisputeProcessor.processClosed(stripe_event, function(err, activity) {
          callback(err, activity);
        });
        break;
      case "charge.dispute.updated":
      CustomerDisputeProcessor.processUpdated(stripe_event, function(err, activity) {
        callback(err, activity);
      });
        break;
      case "charge.dispute.funds_withdrawn":
        CustomerDisputeProcessor.processFundsWithdrawn(stripe_event, function(err, activity) {
          callback(err, activity);
        });
        break;
      case "charge.dispute.funds_reinstated":
        CustomerDisputeProcessor.processFundsReinstated(stripe_event, function(err, activity) {
          callback(err, activity);
        });
        break;
      case "coupon.created":
        CouponProcessor.processCreated(stripe_event, function(err, activity) {
          callback(err, activity);
        });
        break;
      case "coupon.deleted":
        CouponProcessor.processDeleted(stripe_event, function(err, activity) {
          callback(err, activity);
        });
        break;
      case "coupon.updated":
        CouponProcessor.processUpdated(stripe_event, function(err, activity) {
          callback(err, activity);
        });
        break;
      case "customer.created":
        CustomerProcessor.processCreated(stripe_event, bull, function(err, activity) {
          callback(err, activity);
        });
        break;
      case "customer.deleted":
        CustomerProcessor.processDeleted(stripe_event, function(err, activity) {
          callback(err, activity);
        });
        break;
      case "customer.updated":
        CustomerProcessor.processUpdated(stripe_event, function(err, activity) {
          callback(err, activity);
        });
        break;
      case "customer.discount.created":
        CustomerDiscountProcessor.processCreated(stripe_event, function(err, activity) {
          callback(err, activity);
        });
        break;
      case "customer.discount.deleted":
        CustomerDiscountProcessor.processDeleted(stripe_event, function(err, activity) {
          callback(err, activity);
        });
        break;
      case "customer.discount.updated":
        CustomerDiscountProcessor.processUpdated(stripe_event, function(err, activity) {
          callback(err, activity);
        });
        break;
      case "customer.source.created":
        CustomerSourceProcessor.processCreated(stripe_event, function(err, activity) {
          callback(err, activity);
        });
        break;
      case "customer.source.deleted":
        CustomerSourceProcessor.processDeleted(stripe_event, function(err, activity) {
          callback(err, activity);
        });
        break;
      case "customer.source.updated":
        CustomerSourceProcessor.processUpdated(stripe_event, function(err, activity) {
          callback(err, activity);
        });
        break;
      case "plan.created":
        PlanProcessor.processCreated(stripe_event, function(err, activity) {
          callback(err, activity);
        });
        break;
      case "plan.deleted":
        PlanProcessor.processDeleted(stripe_event, function(err, activity) {
          callback(err, activity);
        });
        break;
      case "plan.updated":
        PlanProcessor.processUpdated(stripe_event, function(err, activity) {
          callback(err, activity);
        });
        break;
      case "source.canceled":
        SourceProcessor.processCanceled(stripe_event, function(err, activity) {
          callback(err, activity);
        });
        break;
      case "source.chargeable":
        SourceProcessor.processChargeable(stripe_event, function(err, activity) {
          callback(err, activity);
        });
        break;
      case "source.failed":
        SourceProcessor.processFailed(stripe_event, function(err, activity) {
          callback(err, activity);
        });
        break;
      //case "source.transaction.created":
      //break;
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
        // case "customer.invoice_item.created":
        //   break;
        // case "customer.invoice_item.deleted":
        //   break;
        // case "customer.invoice_item.updated":
        //   break;
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
