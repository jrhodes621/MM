var expect                = require("chai").expect;
var Account               = require("../../models/account");
var Charge                = require("../../models/charge");
var ChargeDispute         = require("../../models/charge_dispute");
var Membership            = require("../../models/membership");
var PaymentCard           = require("../../models/payment_card");
var User                  = require("../../models/user");
var ChargeDisputeParser   = require("../../parsers/stripe/charge_dispute_parser");
var mongoose              = require("mongoose");
var async                 = require("async");

var stripe_charge_dispute = {
  "id": "dp_19Znev4IZxLlgOpCtSGmhVMT",
  "object": "dispute",
  "amount": 1000,
  "balance_transactions": [

  ],
  "charge": "ch_19ZkKz4IZxLlgOpCenAgbiox",
  "created": 1483908777,
  "currency": "usd",
  "evidence": {
    "access_activity_log": null,
    "billing_address": null,
    "cancellation_policy": null,
    "cancellation_policy_disclosure": null,
    "cancellation_rebuttal": null,
    "customer_communication": null,
    "customer_email_address": null,
    "customer_name": null,
    "customer_purchase_ip": null,
    "customer_signature": null,
    "duplicate_charge_documentation": null,
    "duplicate_charge_explanation": null,
    "duplicate_charge_id": null,
    "product_description": null,
    "receipt": null,
    "refund_policy": null,
    "refund_policy_disclosure": null,
    "refund_refusal_explanation": null,
    "service_date": null,
    "service_documentation": null,
    "shipping_address": null,
    "shipping_carrier": null,
    "shipping_date": null,
    "shipping_documentation": null,
    "shipping_tracking_number": null,
    "uncategorized_file": null,
    "uncategorized_text": null
  },
  "evidence_details": {
    "due_by": 1485561599,
    "has_evidence": false,
    "past_due": false,
    "submission_count": 0
  },
  "is_charge_refundable": false,
  "livemode": false,
  "metadata": {
  },
  "reason": "general",
  "status": "needs_response"
}

describe("Charge Dispute Parser", function() {
  var bull = null;
  var user = null;
  var membership = null;
  var payment_card = null;
  var current_charge = null;

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

        membership.reference_id = "2";
        membership.user = user;
        membership.account = bull;
        membership.member_since = new Date();

        membership.save(function(err) {
          callback(err);
        });
      },
      function addPaymentCard(callback) {
        payment_card = new PaymentCard();

        payment_card.reference_id = "1";
        payment_card.brand = "Visa";
        payment_card.last4 = "1111";
        payment_card.exp_month = "11";
        payment_card.exp_year = "2020";
        payment_card.status = "active";

        payment_card.save(function(err) {
          callback(err);
        });
      },
      function addCharge(callback) {
        current_charge = new Charge();

        current_charge.membership = membership;
        current_charge.payment_card = payment_card;
        current_charge.reference_id = "ch_19ZkKz4IZxLlgOpCenAgbiox";
        current_charge.amount = 1000.00;
        current_charge.amount_refunded = 0;
        current_charge.balance_transaction = null;
        current_charge.captured = true;
        current_charge.charge_created = new Date();
        current_charge.currency = "usd";
        current_charge.description = "test charge";
        current_charge.destination = null;
        current_charge.dispute = null;
        current_charge.status = "Active";

        current_charge.save(function(err) {
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
      function removePaymentCards(callback) {
        PaymentCard.remove({}, function() {
          callback();
        });
      },
      function removeCharges(callback) {
        Charge.remove({}, function() {
          callback();
        });
      },
      function removeChargeDispute(callback) {
        ChargeDispute.remove({}, function() {
          callback();
        });
      }
    ], function(err) {
      mongoose.connection.close();

      done(err);
    });
  });
  describe("Parse Stripe Charge Dispute", function() {
    it("parses a Stripe Charge dispute JSON object into a charge_dispute", function(done) {
      ChargeDisputeParser.parse(stripe_charge_dispute, function(err, charge_dispute) {
        expect(charge_dispute.reference_id).to.equal(stripe_charge_dispute.id);
        expect(mongoose.Schema.Types.ObjectId(charge_dispute.charge._id)).to.equal(mongoose.Schema.Types.ObjectId(current_charge._id));
        expect(charge_dispute.amount).to.equal(stripe_charge_dispute.amount);
        //expect(charge_dispute.dispute_created).to.equal(stripe_charge_dispute.created);
        expect(charge_dispute.is_charge_refundable).to.equal(stripe_charge_dispute.is_charge_refundable);
        expect(charge_dispute.evidence).to.equal(stripe_charge_dispute.evidence);
        expect(charge_dispute.evidence_details).to.equal(stripe_charge_dispute.evidence_details);
        expect(charge_dispute.reason).to.equal(stripe_charge_dispute.reason);
        expect(charge_dispute.status).to.equal(stripe_charge_dispute.status);

        done(err);
      });
    });
    it("returns error if the charge does not exist", function(done) {
      Charge.remove({}, function() {
        ChargeDisputeParser.parse(stripe_charge_dispute, function(err, charge_dispute) {
          expect(err).to.be.an('error');

          done();
        });
      });
    })
  });
});
