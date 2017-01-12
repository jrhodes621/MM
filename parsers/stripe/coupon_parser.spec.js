var expect                = require("chai").expect;
var Account               = require("../../models/account");
var Coupon                = require("../../models/coupon");
var CouponParser          = require("../../parsers/stripe/coupon_parser");
var mongoose              = require("mongoose");
var async                 = require("async");

var stripe_coupon = {
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
}

describe("Coupon Parser", function() {
  var bull = null;

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
    })
  });
  describe("Parse Stripe Coupon", function() {
    it("parses a Stripe Coupon JSON object into a charge object", function(done) {
      CouponParser.parse(bull, stripe_coupon, function(err, coupon) {
        expect(coupon.account).to.equal(bull);
        expect(coupon.reference_id).to.equal(stripe_coupon.id);
        expect(coupon.amount_off).to.equal(stripe_coupon.amount_off);
        //expect(coupon.coupon_created).to.equal(stripe_coupon.created);
        expect(coupon.currency).to.equal(stripe_coupon.currency);
        expect(coupon.duration).to.equal(stripe_coupon.duration);
        expect(coupon.duration_in_months).to.equal(stripe_coupon.duration_in_months);
        expect(coupon.max_redemptions).to.equal(stripe_coupon.max_redemptions);
        expect(coupon.percent_off).to.equal(stripe_coupon.percent_off);
        expect(coupon.redeem_by).to.equal(stripe_coupon.redeem_by);
        expect(coupon.times_redeemed).to.equal(stripe_coupon.times_redeemed);
        expect(coupon.valid).to.equal(stripe_coupon.valid);

        done(err);
      });
    });
  });
});
