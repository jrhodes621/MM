var expect                = require("chai").expect;
var mongoose              = require("mongoose");
var async                 = require('async');

var AccountFixtures           = require("../../test/fixtures/account.fixtures.js");
var UserFixtures            = require("../../test/fixtures/user.fixtures.js");
var BeforeHooks               = require("../../test/hooks/before.hooks.js");
var AfterHooks                = require("../../test/hooks/after.hooks.js");

var CustomerParser            = require("../../parsers/stripe/customer_parser");

describe("Customer Parser", () => {
  var bull = null;

  beforeEach((done) =>{
    //add some test data
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
  });
  afterEach((done) =>{
    AfterHooks.CleanUpDatabase((err) => {
      done(err);
    });
  });
  describe("Parse Stripe Customer", () => {
    it("parses a Stripe Custom JSON object into a user", (done) => {
      CustomerParser.parse(bull, UserFixtures.StripeCustomer, function(err, user) {
        if(err) { console.log(err); }

        //expect(subscription.plan._id).to.equal(plan._id)
        //expect(subscription.membership).to.equal(membership._id);
        expect(user.email_address).to.equal(UserFixtures.StripeCustomer.email);
        //expect(subscription.subscription_created_at).to.equal(stripe_subscription.created);
        //expect(subscription.subscription_canceled_at).to.equal(stripe_subscription.canceled_at);
        //expect(subscription.trail_start).to.equal(stripe_subscription.trial_start);
        //expect(subscription.trail_end).to.equal(stripe_subscription.trial_end);
        expect(user.status).to.equal("Active");

        done(err);
      });
    });
  });
});
