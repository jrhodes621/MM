var expect                = require("chai").expect;
var mongoose              = require("mongoose");
var async                 = require("async");

var AccountFixtures           = require("../../test/fixtures/account.fixtures.js");
var CouponFixtures            = require("../../test/fixtures/coupon.fixtures.js");
var BeforeHooks               = require("../../test/hooks/before.hooks.js");
var AfterHooks                = require("../../test/hooks/after.hooks.js");

var CouponParser              = require("../../parsers/stripe/coupon_parser");

describe("Coupon Parser", function() {
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

  describe("Parse Stripe Coupon", function() {
    it("parses a Stripe Coupon JSON object into a charge object", function(done) {
      CouponParser.parse(bull, CouponFixtures.StripeCoupon, function(err, coupon) {
        expect(coupon.account).to.equal(bull);
        expect(coupon.reference_id).to.equal(CouponFixtures.StripeCoupon.id);
        expect(coupon.amount_off).to.equal(CouponFixtures.StripeCoupon.amount_off);
        //expect(coupon.coupon_created).to.equal(CouponFixtures.StripeCoupon.created);
        expect(coupon.currency).to.equal(CouponFixtures.StripeCoupon.currency);
        expect(coupon.duration).to.equal(CouponFixtures.StripeCoupon.duration);
        expect(coupon.duration_in_months).to.equal(CouponFixtures.StripeCoupon.duration_in_months);
        expect(coupon.max_redemptions).to.equal(CouponFixtures.StripeCoupon.max_redemptions);
        expect(coupon.percent_off).to.equal(CouponFixtures.StripeCoupon.percent_off);
        expect(coupon.redeem_by).to.equal(CouponFixtures.StripeCoupon.redeem_by);
        expect(coupon.times_redeemed).to.equal(CouponFixtures.StripeCoupon.times_redeemed);
        expect(coupon.valid).to.equal(CouponFixtures.StripeCoupon.valid);

        done(err);
      });
    });
  });
});
