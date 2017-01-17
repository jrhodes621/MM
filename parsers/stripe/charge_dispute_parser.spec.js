var expect                    = require("chai").expect;
var mongoose                  = require("mongoose");
var async                     = require("async");

var AccountFixtures           = require("../../test/fixtures/account.fixtures.js");
var ChargeFixtures            = require("../../test/fixtures/charge.fixtures.js");
var ChargeDisputeFixtures     = require("../../test/fixtures/charge_dispute.fixtures.js");
var MembershipFixtures        = require("../../test/fixtures/membership.fixtures.js");
var PaymentCardFixtures       = require("../../test/fixtures/payment_card.fixtures.js");
var UserFixtures              = require("../../test/fixtures/user.fixtures.js");
var BeforeHooks               = require("../../test/hooks/before.hooks.js");
var AfterHooks                = require("../../test/hooks/after.hooks.js");

var Charge                    = require("../../models/charge");

var ChargeDisputeParser       = require("../../parsers/stripe/charge_dispute_parser");

describe("Charge Dispute Parser", function() {
  var bull = null;
  var user = null;
  var membership = null;
  var payment_card = null;
  var charge = null;

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
    ], function(err) {
      done(err);
    });
  });
  afterEach(function(done){
    AfterHooks.CleanUpDatabase(function(err) {
      done(err);
    });
  });
  describe("Parse Stripe Charge Dispute", function() {
    it("parses a Stripe Charge dispute JSON object into a charge_dispute", function(done) {
      ChargeDisputeParser.parse(ChargeDisputeFixtures.StripeChargeDispute, function(err, charge_dispute) {
        if(err) { console.log(err); }
        expect(charge_dispute.reference_id).to.equal(ChargeDisputeFixtures.StripeChargeDispute.id);
        expect(mongoose.Schema.Types.ObjectId(charge_dispute.charge._id)).to.equal(mongoose.Schema.Types.ObjectId(charge._id));
        expect(charge_dispute.amount).to.equal(ChargeDisputeFixtures.StripeChargeDispute.amount);
        //expect(charge_dispute.dispute_created).to.equal(stripe_charge_dispute.created);
        expect(charge_dispute.is_charge_refundable).to.equal(ChargeDisputeFixtures.StripeChargeDispute.is_charge_refundable);
        expect(charge_dispute.evidence).to.equal(ChargeDisputeFixtures.StripeChargeDispute.evidence);
        expect(charge_dispute.evidence_details).to.equal(ChargeDisputeFixtures.StripeChargeDispute.evidence_details);
        expect(charge_dispute.reason).to.equal(ChargeDisputeFixtures.StripeChargeDispute.reason);
        expect(charge_dispute.status).to.equal(ChargeDisputeFixtures.StripeChargeDispute.status);

        done(err);
      });
    });
    it("returns error if the charge does not exist", function(done) {
      Charge.remove({}, function() {
        ChargeDisputeParser.parse(ChargeDisputeFixtures.StripeChargeDispute, function(err, charge_dispute) {
          expect(err).to.be.an('error');

          done();
        });
      });
    })
  });
});
