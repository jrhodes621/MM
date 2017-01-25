var expect                    = require("chai").expect;
var mongoose                  = require("mongoose");
var async                     = require('async');

var StripeWebhookFixtures     = require("../../test/fixtures/stripe/webhooks/invoice.fixtures.js");
var AccountFixtures            = require("../../test/fixtures/account.fixtures.js");
var BeforeHooks               = require("../../test/hooks/before.hooks.js");
var AfterHooks                = require("../../test/hooks/after.hooks.js");

var StripeWebhookProcessor         = require("../stripe_event_processors/invoice_processor.js");

describe("stripe invoice webhooks", () => {
  var bull = null;

  beforeEach((done) =>{
    async.waterfall([
      function openConnection(callback) {
        BeforeHooks.SetupDatabase(callback)
      },
      function addBull(callback) {
        BeforeHooks.SetupBull(AccountFixtures.bull, function(err, account) {
          console.log(account);
          bull = account;

          callback(err);
        });
      }
    ], (err) => {
      done(err);
    });
  })
  afterEach((done) =>{
    AfterHooks.CleanUpDatabase((err) => {
      done(err);
    });
  });
  describe("invoice created", () => {
    it("should create an invoice", (done) => {
      var stripe_event = StripeWebhookFixtures.Created;

      StripeWebhookProcessor.processCreated(stripe_event, bull, function(err, invoice, activities) {
        expect(invoice).to.be.an('object');
        //expect(plan.archive).to.equal(false);

        done(err);
      });
    });
    // it("should log an activity") {
    //
    // }
    // it("should ignore the webhook if the same webhook was already processed") {
    //
    // }
    // it("should send a notification to bull") {
    //
    // }
  });
  describe("invoice updated", () => {
    it("should find and update the user", (done) => {
      var stripe_event = StripeWebhookFixtures.Updated;

      StripeWebhookProcessor.processUpdated(stripe_event, bull, function(err, invoice, activities) {
        if(err) { console.log(err); }

        expect(invoice).to.be.an('object');
        //expect(plan.archive).to.equal(false);

        done(err);
      });
    });
    // it("should create the plan if the plan does not exist") {
    //
    // }
    // it("should send a notification to bull") {
    //
    // }
    // it("should ignore the webhook if the same webhook was already processed") {
    //
    // }
    // it("should return an error if the plan can't be found") {
    //
    // }
  });
  describe("invoice payment failed", () => {
    it("should update the archive flag to true", (done) => {
      var stripe_event = StripeWebhookFixtures.PaymentFailed;

      StripeWebhookProcessor.processPaymentFailed(stripe_event, bull, function(err, invoice, activities) {
        if(err) { console.log(err); }

        expect(invoice).to.be.an('object');
        //expect(user.archive).to.equal(true);

        done(err);
      });
    })
    // it("should send a notification to bull") {
    //
    // }
    // it("should return an error if the plan can't be found") {
    //
    // }
    // it("should ignore the webhook if the same webhook was already processed") {
    //
    // }
  });
  describe("invoice payment succeeded", () => {
    it("should update the status", (done) => {
      var stripe_event = StripeWebhookFixtures.PaymentSucceeded;

      StripeWebhookProcessor.processPaymentSucceeded(stripe_event, bull, function(err, invoice, activities) {
        if(err) { console.log(err); }

        expect(invoice).to.be.an('object');
        //expect(user.archive).to.equal(true);

        done(err);
      });
    })
    // it("should send a notification to bull") {
    //
    // }
    // it("should return an error if the plan can't be found") {
    //
    // }
    // it("should ignore the webhook if the same webhook was already processed") {
    //
    // }
  });
  describe("invoice sent", () => {
    it("should update the send status", (done) => {
      var stripe_event = StripeWebhookFixtures.Sent;

      StripeWebhookProcessor.processSent(stripe_event, bull, function(err, invoice, activities) {
        if(err) { console.log(err); }

        expect(invoice).to.be.an('object');
        //expect(user.archive).to.equal(true);

        done(err);
      });
    })
    // it("should send a notification to bull") {
    //
    // }
    // it("should return an error if the plan can't be found") {
    //
    // }
    // it("should ignore the webhook if the same webhook was already processed") {
    //
    // }
  });
  describe("invoice update", () => {
    it("should update the invoice", (done) => {
      var stripe_event = StripeWebhookFixtures.Sent;

      StripeWebhookProcessor.processUpdated(stripe_event, bull, function(err, invoice, activities) {
        if(err) { console.log(err); }

        expect(invoice).to.be.an('object');
        //expect(user.archive).to.equal(true);

        done(err);
      });
    })
    // it("should send a notification to bull") {
    //
    // }
    // it("should return an error if the plan can't be found") {
    //
    // }
    // it("should ignore the webhook if the same webhook was already processed") {
    //
    // }
  });
});
