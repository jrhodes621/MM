var expect                = require("chai").expect;
var mongoose              = require("mongoose");
var async                 = require("async");

var AccountFixtures           = require("../../test/fixtures/account.fixtures.js");
var PaymentCardFixtures       = require("../../test/fixtures/payment_card.fixtures.js");
var MembershipFixtures        = require("../../test/fixtures/membership.fixtures.js");
var UserFixtures              = require("../../test/fixtures/user.fixtures.js");
var BeforeHooks               = require("../../test/hooks/before.hooks.js");
var AfterHooks                = require("../../test/hooks/after.hooks.js");

var CustomerCardParser        = require("../../parsers/stripe/customer_card_parser");

var status = "Active";

describe("Customer Card Parser", function() {
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
  describe("Parse Stripe Card", function() {
    it("parses a Stripe Card JSON object into a card object", function(done) {
      CustomerCardParser.parse(PaymentCardFixtures.StripeCard, function(err, payment_card) {
        if(err) { console.log(err); }

        expect(payment_card.reference_id).to.equal(PaymentCardFixtures.StripeCard.id);
        expect(payment_card.name).to.equal(PaymentCardFixtures.StripeCard.name);
        expect(payment_card.brand).to.equal(PaymentCardFixtures.StripeCard.brand);
        expect(payment_card.last4).to.equal(PaymentCardFixtures.StripeCard.last4);
        expect(payment_card.exp_month).to.equal(PaymentCardFixtures.StripeCard.exp_month);
        expect(payment_card.exp_year).to.equal(PaymentCardFixtures.StripeCard.exp_year);
        expect(payment_card.status).to.equal(status);
        expect(payment_card.archive).to.equal(false);

        done(err);
      });
    });
  });
});
