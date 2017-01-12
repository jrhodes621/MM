var expect                = require("chai").expect;
var Account               = require("../../models/account");
var Membership            = require("../../models/membership");
var Plan                  = require("../../models/plan");
var User                  = require("../../models/user");
var SubscriptionParser    = require("../../parsers/stripe/customer_subscription_parser");
var mongoose              = require("mongoose");
var async                 = require("async");

var stripe_subscription = {
  "id": "sub_7VaeoYjKcYJzQI",
  "object": "subscription",
  "application_fee_percent": null,
  "cancel_at_period_end": false,
  "canceled_at": null,
  "created": 1449773303,
  "current_period_end": 1484074103,
  "current_period_start": 1481395703,
  "customer": "cus_7Vaek4PEyYBvsJ",
  "discount": null,
  "ended_at": null,
  "livemode": false,
  "metadata": {
  },
  "plan": {
    "id": "Test ABCEFC",
    "object": "plan",
    "amount": 10000,
    "created": 1449549532,
    "currency": "usd",
    "interval": "month",
    "interval_count": 1,
    "livemode": false,
    "metadata": {
    },
    "name": "Test ABCEFC",
    "statement_descriptor": null,
    "trial_period_days": null
  },
  "quantity": 1,
  "start": 1481090207,
  "status": "active",
  "tax_percent": null,
  "trial_end": null,
  "trial_start": null
}

describe("Customer Subscription Parser", function() {
  var bull = null;

  beforeEach(function(done){
    //add some test data
    async.waterfall([
      function openConnection(callback) {
        mongoose.connect('mongodb://localhost/membermoose_test', callback);
      },
      function addBull(callback) {
        bull = new Account();

        bull.reference_id = "1";
        bull.company_name = "MemberMoose";
        bull.subdomain = "membermoose";
        bull.status = "Active";

        bull.save(function(err) {
          callback(err);
        });
      }
    ], function(err) {
      done(err);
    });
  });
  afterEach(function(done){
    //delete all the customer records
    async.waterfall([
      function removeAccounts(callback) {
        Account.remove({}, function() {
          callback();
        })
      },
      function removeUsers(callback) {
        User.remove({}, function() {
          callback();
        });
      },
      function removeMemberships(callback) {
        Membership.remove({}, function() {
          callback();
        });
      },
      function removePlans(callback) {
        Plan.remove({}, function() {
          callback();
        });
      }
    ], function(err) {
      mongoose.connection.close();

      done(err);
    });
  });
  describe("Parse Stripe Customer Subscription", function() {
    it("parses a Stripe Subscription JSON object into a subscription", function(done) {
      SubscriptionParser.parse(bull, stripe_subscription, function(err, subscription) {
        if(err) { console.log(err); }

        //expect(subscription.plan._id).to.equal(plan._id)
        //expect(subscription.membership).to.equal(membership._id);
        expect(subscription.reference_id).to.equal(stripe_subscription.id);
        //expect(subscription.subscription_created_at).to.equal(stripe_subscription.created);
        //expect(subscription.subscription_canceled_at).to.equal(stripe_subscription.canceled_at);
        //expect(subscription.trail_start).to.equal(stripe_subscription.trial_start);
        //expect(subscription.trail_end).to.equal(stripe_subscription.trial_end);
        expect(subscription.status).to.equal(stripe_subscription.status);

        done(err);
      });
    });
  });
});
