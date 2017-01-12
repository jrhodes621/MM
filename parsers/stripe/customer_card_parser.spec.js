var expect                = require("chai").expect;
var Account               = require("../../models/account");
var Membership            = require("../../models/membership");
var PaymentCard           = require("../../models/payment_card");
var User                  = require("../../models/user");
var CustomerCardParser    = require("../../parsers/stripe/customer_card_parser");
var mongoose              = require("mongoose");
var async                 = require("async");

var stripe_card = {
  "id": "card_19Zney4IZxLlgOpCZJwA1jCD",
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
  "customer": null,
  "cvc_check": null,
  "dynamic_last4": null,
  "exp_month": 8,
  "exp_year": 2018,
  "funding": "credit",
  "last4": "4242",
  "metadata": {
  },
  "name": null,
  "tokenization_method": null
}
var status = "Active";

describe("Customer Card Parser", function() {
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

        membership.reference_id = "1";
        membership.user = user;
        membership.account = bull;
        membership.member_since = new Date();

        membership.save(function(err) {
          callback(err);
        });
      },
    ], function(err) {
      done(err);
    });
  });
  afterEach(function(done) {
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
      }
    ], function(err) {
      mongoose.connection.close();

      done(err);
    })
  });
  describe("Parse Stripe Card", function() {
    it("parses a Stripe Card JSON object into a card object", function(done) {
      CustomerCardParser.parse(stripe_card, function(err, payment_card) {
        expect(payment_card.reference_id).to.equal(stripe_card.id);
        expect(payment_card.name).to.equal(stripe_card.name);
        expect(payment_card.brand).to.equal(stripe_card.brand);
        expect(payment_card.last4).to.equal(stripe_card.last4);
        expect(payment_card.exp_month).to.equal(stripe_card.exp_month);
        expect(payment_card.exp_year).to.equal(stripe_card.exp_year);
        expect(payment_card.status).to.equal(status);
        expect(payment_card.archive).to.equal(false);

        done(err);
      });
    });
  });
});
