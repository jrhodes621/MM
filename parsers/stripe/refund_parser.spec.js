var expect                    = require("chai").expect;
var mongoose                  = require("mongoose");
var async                     = require('async');

var AccountFixtures           = require("../../test/fixtures/account.fixtures.js");
var ChargeFixtures            = require("../../test/fixtures/charge.fixtures.js");
var ChargeDisputeFixtures     = require("../../test/fixtures/charge_dispute.fixtures.js");
var MembershipFixtures        = require("../../test/fixtures/membership.fixtures.js");
var PaymentCardFixtures       = require("../../test/fixtures/payment_card.fixtures.js");
var RefundFixtures            = require("../../test/fixtures/refund.fixtures.js");
var UserFixtures              = require("../../test/fixtures/user.fixtures.js");
var BeforeHooks               = require("../../test/hooks/before.hooks.js");
var AfterHooks                = require("../../test/hooks/after.hooks.js");

var Charge                    = require("../../models/charge");

var RefundParser          = require("../../parsers/stripe/refund_parser");

var charge_id = "ch_1754tJ4IZxLlgOpC0AhdTwTn";

describe("Refund Parser", () => {
  var bull = null;
  var user = null;
  var membership = null;
  var payment_card = null;
  var charge = null;

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
  describe("Parse Stripe Refund", () => {
    it("parses a Stripe Refund JSON object into a refund object", (done) => {
      RefundParser.parse(RefundFixtures.StripeRefund, function(err, refund) {
        if(err) { console.log(err); }

        expect(mongoose.Schema.Types.ObjectId(refund.charge._id)).to.equal(mongoose.Schema.Types.ObjectId(charge._id));
        expect(refund.reference_id).to.equal(RefundFixtures.StripeRefund.id);
        expect(refund.amount).to.equal(RefundFixtures.StripeRefund.amount);
        expect(refund.currency).to.equal(RefundFixtures.StripeRefund.currency);
        //expect(refund.refund_created).to.equal(RefundFixtures.StripeRefund.created);
        expect(refund.description).to.equal(RefundFixtures.StripeRefund.description);
        expect(refund.reason).to.equal(RefundFixtures.StripeRefund.reason);
        expect(refund.receipt_number).to.equal(RefundFixtures.StripeRefund.receipt_number);
        expect(refund.status).to.equal(RefundFixtures.StripeRefund.status);

        done(err);
      });
    });
  });
});
