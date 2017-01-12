var expect                    = require("chai").expect;
var CustomerDiscountParser    = require("../../parsers/stripe/customer_discount_parser");
var Account                   = require("../../models/account");
var Coupon                    = require("../../models/coupon");
var Discount                  = require("../../models/discount");
var Membership                = require("../../models/membership");
var Plan                      = require("../../models/plan");
var Subscription              = require("../../models/subscription");
var User                      = require("../../models/user");
var mongoose                  = require("mongoose");
var async                     = require("async");

var stripe_discount = {
  "object": "discount",
  "coupon": {
    "id": "32xuSh5g",
    "object": "coupon",
    "amount_off": null,
    "created": 1449549430,
    "currency": "usd",
    "duration": "once",
    "duration_in_months": null,
    "livemode": false,
    "max_redemptions": null,
    "metadata": {
    },
    "percent_off": 1,
    "redeem_by": null,
    "times_redeemed": 0,
    "valid": true
  },
  "customer": "cus_9tagyvZXCzFCj9",
  "end": null,
  "start": 1449543999,
  "subscription": "sub_7Ub0lcBP8An6jC"
}

describe("Customer Discount Parser", function() {
  var bull = null;
  var user = null;
  var membership = null;
  var plan = null;
  var subscription = null;

  beforeEach(function(done){
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
      },
      function addUser(callback) {
        user = new User();

        user.email_address = "james@somehero.com";
        user.password = "test123";
        user.status = "active";

        user.save(function(err) {
          callback(err);
        });
      },
      function addMembership(callback) {
        membership = new Membership();

        membership.reference_id = "cus_9tagyvZXCzFCj9";
        membership.user = user;
        membership.account = bull;
        membership.member_since = new Date();

        membership.save(function(err) {
          callback(err);
        });
      },
      function addPlan(callback) {
        plan = new Plan();

        plan.account = bull;
        plan.name = "Fake Plan";
        plan.amount = 100;
        plan.interval = 0;
        plan.interval_count = 1;

        plan.save(function(err) {
          callback(err);
        });
      },
      function addSubscription(callback) {
        subscription = new Subscription();

        subscription.plan = plan;
        subscription.membership = membership;
        subscription.reference_id = "sub_7Ub0lcBP8An6jC";
        subscription.status = "active"
        subscription.subscription_created_at = new Date(); //ToDo: Implment

        subscription.save(function(err) {
          callback(err);
        })
      }
    ], function(err) {
      done(err);
    });
  });
  afterEach(function(done) {
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
      },
      function removeSubscriptions(callback) {
        Subscription.remove({}, function() {
          callback();
        });
      },
      function removeDiscounts(callback) {
        Discount.remove({}, function() {
          callback();
        });
      },
      function removeCoupons(callback) {
        Coupon.remove({}, function() {
          callback();
        });
      }
    ], function(err) {
      mongoose.connection.close();

      done(err);
    });
  });
  describe("Parse Stripe Discount", function() {
    it("parses a Stripe Discount JSON object into a discount object", function(done) {
      CustomerDiscountParser.parse(bull, stripe_discount, function(err, discount, coupon) {
        if(err) { console.log(err); }

        expect(mongoose.Schema.Types.ObjectId(discount.membership._id)).to.equal(mongoose.Schema.Types.ObjectId(membership._id));
        expect(mongoose.Schema.Types.ObjectId(discount.subscription._id)).to.equal(mongoose.Schema.Types.ObjectId(subscription._id));
        //expect(discount.start).to.equal(stripe_discount.start);
        expect(discount.end).to.equal(stripe_discount.end);
        expect(mongoose.Schema.Types.ObjectId(discount.coupon._id)).to.equal(mongoose.Schema.Types.ObjectId(coupon._id));

        done(err);
      });
    });
  });
});
