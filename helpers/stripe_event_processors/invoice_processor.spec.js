var expect                    = require("chai").expect;
var mongoose                  = require("mongoose");
var async                     = require("async");

var StripeWebhookFixtures     = require("../../test/fixtures/stripe/webhooks/invoice.fixtures.js");
var AccountFixtures            = require("../../test/fixtures/account.fixtures.js");
var BeforeHooks               = require("../../test/hooks/before.hooks.js");
var AfterHooks                = require("../../test/hooks/after.hooks.js");

var StripeWebhookProcessor         = require("../stripe_event_processors/invoice_processor.js");

describe("stripe invoice webhooks", function() {
  var bull = null;

  beforeEach(function(done){
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
    ], function(err) {
      done(err);
    });
  })
  afterEach(function(done){
    AfterHooks.CleanUpDatabase(function(err) {
      done(err);
    });
  });
  describe("invoice created", function() {
    it("should create an invoice", function(done) {
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
  describe("invoice updated", function() {
    it("should find and update the user", function(done) {
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
  describe("invoice payment failed", function() {
    it("should update the archive flag to true", function(done) {
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
  describe("invoice payment succeeded", function() {
    it("should update the status", function(done) {
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
  describe("invoice sent", function() {
    it("should update the send status", function(done) {
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
  describe("invoice update", function() {
    it("should update the invoice", function(done) {
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
