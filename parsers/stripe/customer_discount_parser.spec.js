var expect                = require("chai").expect;
var mongoose              = require("mongoose");
var async                 = require('async');

var AccountFixtures           = require("../../test/fixtures/account.fixtures.js");
var ChargeFixtures            = require("../../test/fixtures/charge.fixtures.js");
var DiscountFixtures          = require("../../test/fixtures/discount.fixtures.js");
var PaymentCardFixtures       = require("../../test/fixtures/payment_card.fixtures.js");
var MembershipFixtures        = require("../../test/fixtures/membership.fixtures.js");
var PlanFixtures              = require("../../test/fixtures/plan.fixtures.js");
var SubscriptionFixtures      = require("../../test/fixtures/subscription.fixtures.js");
var UserFixtures              = require("../../test/fixtures/user.fixtures.js");
var BeforeHooks               = require("../../test/hooks/before.hooks.js");
var AfterHooks                = require("../../test/hooks/after.hooks.js");

var CustomerDiscountParser    = require("../../parsers/stripe/customer_discount_parser");

describe("Customer Discount Parser", () => {
  var bull = null;
  var user = null;
  var membership = null;
  var plan = null;
  var subscription = null;

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
      },
      function addUser(callback) {
        BeforeHooks.SetupUser(UserFixtures.User, function(err, new_user) {
          user = new_user;

          callback(err);
        });
      },
      function addMembership(callback) {
        BeforeHooks.SetupMembership(MembershipFixtures.Membership, user, bull, function(err, new_membership) {
          membership = new_membership;

          callback(err);
        })
      },
      function addPaymentCard(callback) {
        BeforeHooks.SetupPaymentCard(PaymentCardFixtures.PaymentCard, user, function(err, new_payment_card) {
          payment_card = new_payment_card;

          callback(err);
        })
      },
      function addCharge(callback) {
        BeforeHooks.SetupCharge(ChargeFixtures.Charge, user, membership, payment_card, function(err, new_charge) {
          charge = new_charge;

          callback(err);
        });
      },
      function addPlan(callback) {
        BeforeHooks.SetupPlan(PlanFixtures.Plan, bull, function(err, new_plan) {
          plan = new_plan;

          callback(err);
        });
      },
      function addSubscription(callback) {
        BeforeHooks.SetupSubscription(SubscriptionFixtures.Subscription, plan, membership, function(err, new_subscription) {
          subscription = new_subscription;

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
  describe("Parse Stripe Discount", () => {
    it("parses a Stripe Discount JSON object into a discount object", (done) => {
      CustomerDiscountParser.parse(bull, DiscountFixtures.StripeDiscount, function(err, discount, coupon) {
        if(err) { console.log(err); }

        expect(mongoose.Schema.Types.ObjectId(discount.membership._id)).to.equal(mongoose.Schema.Types.ObjectId(membership._id));
        expect(mongoose.Schema.Types.ObjectId(discount.subscription._id)).to.equal(mongoose.Schema.Types.ObjectId(subscription._id));
        //expect(discount.start).to.equal(DiscountFixtures.StripeDiscount.start);
        expect(discount.end).to.equal(DiscountFixtures.StripeDiscount.end);
        expect(mongoose.Schema.Types.ObjectId(discount.coupon._id)).to.equal(mongoose.Schema.Types.ObjectId(coupon._id));

        done(err);
      });
    });
  });
});
