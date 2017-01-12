var expect                = require("chai").expect;
var Account               = require("../../models/account");
var Membership            = require("../../models/membership");
var Plan                  = require("../../models/plan");
var User                  = require("../../models/user");
var CustomerParser        = require("../../parsers/stripe/customer_parser");
var mongoose              = require("mongoose");
var async                 = require("async");

var stripe_customer = {
  "id": "cus_9tagyvZXCzFCj9",
  "object": "customer",
  "account_balance": 0,
  "created": 1483908144,
  "currency": "usd",
  "default_source": null,
  "delinquent": false,
  "description": null,
  "discount": null,
  "email": "james+200@somehero.com",
  "livemode": false,
  "metadata": {
  },
  "shipping": null,
  "sources": {
    "object": "list",
    "data": [

    ],
    "has_more": false,
    "total_count": 0,
    "url": "/v1/customers/cus_9tagyvZXCzFCj9/sources"
  },
  "subscriptions": {
    "object": "list",
    "data": [

    ],
    "has_more": false,
    "total_count": 0,
    "url": "/v1/customers/cus_9tagyvZXCzFCj9/subscriptions"
  }
}

describe("Customer Parser", function() {
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
  describe("Parse Stripe Customer", function() {
    it("parses a Stripe Custom JSON object into a user", function(done) {
      CustomerParser.parse(bull, stripe_customer, function(err, user) {
        if(err) { console.log(err); }

        //expect(subscription.plan._id).to.equal(plan._id)
        //expect(subscription.membership).to.equal(membership._id);
        expect(user.email_address).to.equal(stripe_customer.email);
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
