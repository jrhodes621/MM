var expect                = require("chai").expect;
var Account               = require("../../models/account");
var Charge                = require("../../models/charge");
var Membership            = require("../../models/membership");
var PaymentCard           = require("../../models/payment_card");
var User                  = require("../../models/user");
var ChargeParser          = require("../../parsers/stripe/charge_parser");
var mongoose              = require("mongoose");
var async                 = require("async");

var status = "succeeded";

var stripe_charge = {
  "id": "ch_19ZkKz4IZxLlgOpCenAgbiox",
  "object": "charge",
  "amount": 10000,
  "amount_refunded": 0,
  "application": null,
  "application_fee": null,
  "balance_transaction": "txn_19ZZAA4IZxLlgOpCeGDfg50w",
  "captured": true,
  "created": 1483896009,
  "currency": "usd",
  "customer": "cus_7UTxa99v3FSx0M",
  "description": null,
  "destination": null,
  "dispute": null,
  "failure_code": null,
  "failure_message": null,
  "fraud_details": {
  },
  "invoice": "in_19ZjOj4IZxLlgOpCnCIfvLPY",
  "livemode": false,
  "metadata": {
  },
  "order": null,
  "outcome": {
    "network_status": "approved_by_network",
    "reason": null,
    "seller_message": "Payment complete.",
    "type": "authorized"
  },
  "paid": true,
  "receipt_email": null,
  "receipt_number": null,
  "refunded": false,
  "refunds": {
    "object": "list",
    "data": [

    ],
    "has_more": false,
    "total_count": 0,
    "url": "/v1/charges/ch_19ZkKz4IZxLlgOpCenAgbiox/refunds"
  },
  "review": null,
  "shipping": null,
  "source": {
    "id": "card_17FUzq4IZxLlgOpCjBu0nro3",
    "object": "card",
    "address_city": null,
    "address_country": null,
    "address_line1": null,
    "address_line1_check": null,
    "address_line2": null,
    "address_state": null,
    "address_zip": null,
    "address_zip_check": null,
    "brand": "Visa",
    "country": "US",
    "customer": "cus_7UTxa99v3FSx0M",
    "cvc_check": null,
    "dynamic_last4": null,
    "exp_month": 6,
    "exp_year": 2019,
    "funding": "unknown",
    "last4": "1111",
    "metadata": {
    },
    "name": "James G Rhodes",
    "tokenization_method": null
  },
  "source_transfer": null,
  "statement_descriptor": null,
  "status": "succeeded"
}

describe("Charge Parser", function() {
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

        payment_card.reference_id = "card_17FUzq4IZxLlgOpCjBu0nro3";
        payment_card.brand = "Visa";
        payment_card.last4 = "1111";
        payment_card.exp_month = "11";
        payment_card.exp_year = "2020";
        payment_card.status = "active";

        payment_card.save(function(err) {
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
      }
    ], function(err) {
      mongoose.connection.close();

      done(err);
    });
  });
  describe("Parse Stripe Charge", function() {
    it("parses a Stripe Charge JSON object into a charge object", function(done) {
      ChargeParser.parse(membership, stripe_charge, status, function(err, charge) {
        expect(mongoose.Schema.Types.ObjectId(charge.membership._id)).to.equal(mongoose.Schema.Types.ObjectId(membership._id));
        expect(charge.reference_id).to.equal(stripe_charge.id);
        expect(mongoose.Schema.Types.ObjectId(charge.payment_card._id)).to.equal(mongoose.Schema.Types.ObjectId(payment_card._id));
        expect(charge.amount_refunded).to.equal(stripe_charge.amount_refunded);
        expect(charge.amount).to.equal(stripe_charge.amount/100);
        expect(charge.amount_refunded).to.equal(stripe_charge.amount_refunded);
        expect(charge.balance_transaction).to.equal(stripe_charge.balance_transaction);
        expect(charge.captured).to.equal(stripe_charge.captured);
        //expect(charge.charge_created).to.equal(stripe_charge.created);
        expect(charge.currency).to.equal(stripe_charge.currency);
        expect(charge.description).to.equal(stripe_charge.description);
        expect(charge.destination).to.equal(stripe_charge.destination);
        expect(charge.dispute).to.equal(stripe_charge.dispute);
        expect(charge.failure_code).to.equal(stripe_charge.failure_code);
        expect(charge.failure_message).to.equal(stripe_charge.failure_message);
        expect(charge.invoice).to.equal(stripe_charge.invoice);
        expect(charge.paid).to.equal(stripe_charge.paid);
        expect(charge.receipt_email).to.equal(stripe_charge.receipt_email);
        expect(charge.receipt_number).to.equal(stripe_charge.receipt_number);
        expect(charge.refunded).to.equal(stripe_charge.refunded);
        expect(charge.shipping).to.equal(stripe_charge.shipping);
        expect(charge.source_transfer).to.equal(stripe_charge.source_transfer);
        expect(charge.statement_descriptor).to.equal(stripe_charge.statement_descriptor);
        expect(charge.status).to.equal(stripe_charge.status);
        //expect(charge.card_info).to.equal(stripe_charge.card_info);

        done(err);
      });
    });
  });
});
