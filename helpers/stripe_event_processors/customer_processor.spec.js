var expect                    = require("chai").expect;
var mongoose                  = require("mongoose");
var async                     = require('async');

var StripeWebhookFixtures     = require("../../test/fixtures/stripe/webhooks/customer.fixtures.js");
var AccountFixtures            = require("../../test/fixtures/account.fixtures.js");
var BeforeHooks               = require("../../test/hooks/before.hooks.js");
var AfterHooks                = require("../../test/hooks/after.hooks.js");

var CustomerProcessor         = require("../stripe_event_processors/customer_processor.js");

describe("stripe customer webhooks", () => {
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
  describe("customer created", () => {
    it("should create new user", (done) => {
      var stripe_event = StripeWebhookFixtures.Created;

      CustomerProcessor.processCreated(stripe_event, bull, function(err, user, activities) {
        expect(user).to.be.an('object');
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
  describe("customer updated", () => {
    it("should find and update the user", (done) => {
      var stripe_event = StripeWebhookFixtures.Updated;

      CustomerProcessor.processUpdated(stripe_event, bull, function(err, user, activities) {
        if(err) { console.log(err); }

        expect(user).to.be.an('object');
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
  describe("customer deleted", () => {
    it("should update the archive flag to true", (done) => {
      var stripe_event = StripeWebhookFixtures.Deleted;

      CustomerProcessor.processDeleted(stripe_event, bull, function(err, user, activities) {
        if(err) { console.log(err); }

        expect(user).to.be.an('object');
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
