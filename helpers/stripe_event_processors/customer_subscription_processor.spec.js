var expect                    = require("chai").expect;
var mongoose                  = require("mongoose");
var async                     = require('async');

var StripeWebhookFixtures     = require("../../test/fixtures/stripe/webhooks/customer_subscription.fixtures.js");
var AccountFixtures            = require("../../test/fixtures/account.fixtures.js");
var BeforeHooks               = require("../../test/hooks/before.hooks.js");
var AfterHooks                = require("../../test/hooks/after.hooks.js");

var StripeWebhookProcessor         = require("../stripe_event_processors/customer_subscription_processor.js");

describe("stripe customer subscriptions webhooks", () => {
  var bull = null;

  beforeEach((done) =>{
    async.waterfall([
      function openConnection(callback) {
        BeforeHooks.SetupDatabase(callback)
      },
      function addBull(callback) {
        BeforeHooks.SetupBull(AccountFixtures.bull, function(err, account) {
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
  describe("subscription created", () => {
    it("should create a new subscription", (done) => {
      var stripe_event = StripeWebhookFixtures.Created;

      StripeWebhookProcessor.processCreated(stripe_event, bull, function(err, subscription, activities) {
        if(err) { console.log(err); }

        expect(subscription).to.be.an('object');
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
  describe("subscription updated", () => {
    it("should find and update the subscription", (done) => {
      var stripe_event = StripeWebhookFixtures.Updated;

      StripeWebhookProcessor.processUpdated(stripe_event, bull, function(err, subscription, activities) {
        if(err) { console.log(err); }

        expect(subscription).to.be.an('object');
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
  describe("subscription deleted", () => {
    it("should update the subscription to canceled", (done) => {
      var stripe_event = StripeWebhookFixtures.Deleted;

      StripeWebhookProcessor.processDeleted(stripe_event, bull, function(err, subscription, activities) {
        if(err) { console.log(err); }

        expect(subscription).to.be.an('object');
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
