var expect                = require("chai").expect;
var Account               = require("../../models/account");
var Charge                = require("../../models/charge");
var ChargeDispute         = require("../../models/charge_dispute");
var Membership            = require("../../models/membership");
var PaymentCard           = require("../../models/payment_card");
var User                  = require("../../models/user");
var Refund                = require("../../models/refund");
var RefundParser          = require("../../parsers/stripe/refund_parser");
var mongoose              = require("mongoose");
var async                 = require("async");

var charge_id = "ch_1754tJ4IZxLlgOpC0AhdTwTn";
var stripe_refund = {
  "id": "re_1754td4IZxLlgOpCYr8TaEBs",
  "object": "refund",
  "amount": 3500,
  "balance_transaction": null,
  "charge": charge_id,
  "created": 1447034197,
  "currency": "usd",
  "metadata": {
  },
  "reason": null,
  "receipt_number": null,
  "status": "succeeded"
}

describe("Refund Parser", function() {
  var bull = null;
  var user = null;
  var membership = null;
  var payment_card = null;
  var charge = null;

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
      },
      function addCharge(callback) {
        charge = new Charge();

        charge.membership = membership;
        charge.payment_card = payment_card;
        charge.reference_id = charge_id;
        charge.amount = 1000.00;
        charge.amount_refunded = 0;
        charge.balance_transaction = null;
        charge.captured = true;
        charge.charge_created = new Date();
        charge.currency = "usd";
        charge.description = "test charge";
        charge.destination = null;
        charge.dispute = null;
        charge.status = "Active";

        charge.save(function(err) {
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
  describe("Parse Stripe Refund", function() {
    it("parses a Stripe Refund JSON object into a refund object", function(done) {
      RefundParser.parse(stripe_refund, function(err, refund) {
        if(err) { console.log(err); }

        expect(mongoose.Schema.Types.ObjectId(refund.charge._id)).to.equal(mongoose.Schema.Types.ObjectId(charge._id));
        expect(refund.reference_id).to.equal(stripe_refund.id);
        expect(refund.amount).to.equal(stripe_refund.amount);
        expect(refund.currency).to.equal(stripe_refund.currency);
        //expect(refund.refund_created).to.equal(stripe_refund.created);
        expect(refund.description).to.equal(stripe_refund.description);
        expect(refund.reason).to.equal(stripe_refund.reason);
        expect(refund.receipt_number).to.equal(stripe_refund.receipt_number);
        expect(refund.status).to.equal(stripe_refund.status);

        done(err);
      });
    });
  });
});
