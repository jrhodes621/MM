var expect                = require("chai").expect;
var mongoose              = require("mongoose");
var async                 = require("async");

var AccountFixtures           = require("../../test/fixtures/account.fixtures.js");
var UserFixtures              = require("../../test/fixtures/user.fixtures.js");
var SubscriptionFixtures      = require("../../test/fixtures/subscription.fixtures.js");
var BeforeHooks               = require("../../test/hooks/before.hooks.js");
var AfterHooks                = require("../../test/hooks/after.hooks.js");

var SubscriptionParser        = require("../../parsers/stripe/customer_subscription_parser");

describe("Customer Subscription Parser", function() {
  var bull = null;

  beforeEach(function(done){
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
    ], function(err) {
      done(err);
    });
  });
  afterEach(function(done){
    AfterHooks.CleanUpDatabase(function(err) {
      done(err);
    });
  });
  describe("Parse Stripe Customer Subscription", function() {
    it("parses a Stripe Subscription JSON object into a subscription", function(done) {
      SubscriptionParser.parse(bull, SubscriptionFixtures.StripeSubscription, function(err, subscription) {
        if(err) { console.log(err); }

        //expect(subscription.plan._id).to.equal(plan._id)
        //expect(subscription.membership).to.equal(membership._id);
        expect(subscription.reference_id).to.equal(SubscriptionFixtures.StripeSubscription.id);
        //expect(subscription.subscription_created_at).to.equal(SubscriptionFixtures.StripeSubscription.created);
        //expect(subscription.subscription_canceled_at).to.equal(SubscriptionFixtures.StripeSubscription.canceled_at);
        //expect(subscription.trail_start).to.equal(SubscriptionFixtures.StripeSubscription.trial_start);
        //expect(subscription.trail_end).to.equal(SubscriptionFixtures.StripeSubscription.trial_end);
        expect(subscription.status).to.equal(SubscriptionFixtures.StripeSubscription.status);

        done(err);
      });
    });
  });
});
