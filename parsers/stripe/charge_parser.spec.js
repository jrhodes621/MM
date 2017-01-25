var expect                = require("chai").expect;
var mongoose              = require("mongoose");
var async                 = require('async');

var AccountFixtures           = require("../../test/fixtures/account.fixtures.js");
var ChargeFixtures            = require("../../test/fixtures/charge.fixtures.js");
var ChargeDisputeFixtures     = require("../../test/fixtures/charge_dispute.fixtures.js");
var MembershipFixtures        = require("../../test/fixtures/membership.fixtures.js");
var PaymentCardFixtures       = require("../../test/fixtures/payment_card.fixtures.js");
var UserFixtures              = require("../../test/fixtures/user.fixtures.js");
var BeforeHooks               = require("../../test/hooks/before.hooks.js");
var AfterHooks                = require("../../test/hooks/after.hooks.js");

var ChargeParser              = require("../../parsers/stripe/charge_parser");

var status = "succeeded";

describe("Charge Parser", () => {
  var bull = null;
  var user = null;
  var membership = null;
  var payment_card = null;
  var current_charge = null;

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
        });
      },
      function addPaymentCard(callback) {
        BeforeHooks.SetupPaymentCard(PaymentCardFixtures.PaymentCard, user, function(err, new_payment_card) {
          payment_card = new_payment_card;

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
  describe("Parse Stripe Charge", () => {
    it("parses a Stripe Charge JSON object into a charge object", (done) => {
      ChargeParser.parse(membership, ChargeFixtures.StripeCharge, status, function(err, charge) {
        if(err) { console.log(err); }

        expect(mongoose.Schema.Types.ObjectId(charge.membership._id)).to.equal(mongoose.Schema.Types.ObjectId(membership._id));
        expect(charge.reference_id).to.equal(ChargeFixtures.StripeCharge.id);
        expect(mongoose.Schema.Types.ObjectId(charge.payment_card._id)).to.equal(mongoose.Schema.Types.ObjectId(payment_card._id));
        expect(charge.amount_refunded).to.equal(ChargeFixtures.StripeCharge.amount_refunded);
        expect(charge.amount).to.equal(ChargeFixtures.StripeCharge.amount/100);
        expect(charge.amount_refunded).to.equal(ChargeFixtures.StripeCharge.amount_refunded);
        expect(charge.balance_transaction).to.equal(ChargeFixtures.StripeCharge.balance_transaction);
        expect(charge.captured).to.equal(ChargeFixtures.StripeCharge.captured);
        //expect(charge.charge_created).to.equal(stripe_charge.created);
        expect(charge.currency).to.equal(ChargeFixtures.StripeCharge.currency);
        expect(charge.description).to.equal(ChargeFixtures.StripeCharge.description);
        expect(charge.destination).to.equal(ChargeFixtures.StripeCharge.destination);
        expect(charge.dispute).to.equal(ChargeFixtures.StripeCharge.dispute);
        expect(charge.failure_code).to.equal(ChargeFixtures.StripeCharge.failure_code);
        expect(charge.failure_message).to.equal(ChargeFixtures.StripeCharge.failure_message);
        expect(charge.invoice).to.equal(ChargeFixtures.StripeCharge.invoice);
        expect(charge.paid).to.equal(ChargeFixtures.StripeCharge.paid);
        expect(charge.receipt_email).to.equal(ChargeFixtures.StripeCharge.receipt_email);
        expect(charge.receipt_number).to.equal(ChargeFixtures.StripeCharge.receipt_number);
        expect(charge.refunded).to.equal(ChargeFixtures.StripeCharge.refunded);
        expect(charge.shipping).to.equal(ChargeFixtures.StripeCharge.shipping);
        expect(charge.source_transfer).to.equal(ChargeFixtures.StripeCharge.source_transfer);
        expect(charge.statement_descriptor).to.equal(ChargeFixtures.StripeCharge.statement_descriptor);
        expect(charge.status).to.equal(ChargeFixtures.StripeCharge.status);
        //expect(charge.card_info).to.equal(stripe_charge.card_info);

        done(err);
      });
    });
  });
});
