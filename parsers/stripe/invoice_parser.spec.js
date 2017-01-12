var expect                = require("chai").expect;
var Account               = require("../../models/account");
var Charge                = require("../../models/charge");
var ChargeDispute         = require("../../models/charge_dispute");
var Discount              = require("../../models/discount");
var Invoice               = require("../../models/invoice");
var Membership            = require("../../models/membership");
var PaymentCard           = require("../../models/payment_card");
var User                  = require("../../models/user");
var InvoiceParser         = require("../../parsers/stripe/invoice_parser");
var mongoose              = require("mongoose");
var async                 = require("async");

var stripe_invoice = {
  "id": "in_19ZjOj4IZxLlgOpCnCIfvLPY",
  "object": "invoice",
  "amount_due": 10000,
  "application_fee": null,
  "attempt_count": 1,
  "attempted": true,
  "charge": null,
  "closed": true,
  "currency": "usd",
  "customer": "cus_9tagyvZXCzFCj9",
  "date": 1483892397,
  "description": null,
  "discount": null,
  "ending_balance": 0,
  "forgiven": false,
  "lines": {
    "data": [
      {
        "id": "sub_7VaeoYjKcYJzQI",
        "object": "line_item",
        "amount": 10000,
        "currency": "usd",
        "description": null,
        "discountable": true,
        "livemode": true,
        "metadata": {
        },
        "period": {
          "start": 1484074103,
          "end": 1486752503
        },
        "plan": {
          "id": "Test Plan BCD",
          "object": "plan",
          "amount": 10000,
          "created": 1481060635,
          "currency": "usd",
          "interval": "month",
          "interval_count": 1,
          "livemode": false,
          "metadata": {
          },
          "name": "Test Plan BCD4",
          "statement_descriptor": null,
          "trial_period_days": null
        },
        "proration": false,
        "quantity": 1,
        "subscription": null,
        "type": "subscription"
      }
    ],
    "total_count": 1,
    "object": "list",
    "url": "/v1/invoices/in_19ZjOj4IZxLlgOpCnCIfvLPY/lines"
  },
  "livemode": false,
  "metadata": {
  },
  "next_payment_attempt": null,
  "paid": true,
  "period_end": 1483892360,
  "period_start": 1481213960,
  "receipt_number": null,
  "starting_balance": 0,
  "statement_descriptor": null,
  "subscription": null,
  "subtotal": 10000,
  "tax": null,
  "tax_percent": null,
  "total": 10000,
  "webhooks_delivered_at": 1483892407
}

describe("Invoice Parser", function() {
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

        membership.reference_id = stripe_invoice.customer;
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
      },
      function removeDiscounts(callback) {
        Discount.remove({}, function() {
          callback();
        });
      },
      function removeInvoices(callback) {
        Invoice.remove({}, function() {
          callback();
        });
      }
    ], function(err) {
      mongoose.connection.close();

      done(err);
    });
  });
  describe("Parse Invoice", function() {
    it("parses a Invoice JSON object into a invoice object", function(done) {
      InvoiceParser.parse(bull, stripe_invoice, function(err, invoice) {
        if(err) { console.log(err); }
        //expect(charge.card_info).to.equal(stripe_charge.card_info);
        //expect(invoice.membership).to.equal(membership);
        expect(invoice.reference_id).to.equal(stripe_invoice.id);
        expect(invoice.amount_due).to.equal(stripe_invoice.amount_due);
        expect(invoice.application_fee).to.equal(stripe_invoice.application_fee);
        expect(invoice.attempt_count).to.equal(stripe_invoice.attempt_count);
        expect(invoice.attempted).to.equal(stripe_invoice.attempted);
        //expect(invoice.charge).to.equal(charge);
        expect(invoice.closed).to.equal(stripe_invoice.closed);
        expect(invoice.currency).to.equal(stripe_invoice.currency);
        //expect(invoice.invoice_date).to.equal(stripe_invoice.date);
        expect(invoice.description).to.equal(stripe_invoice.description);
        //expect(invoice.discount).to.equal(discount);
        expect(invoice.ending_balance).to.equal(stripe_invoice.ending_balance);
        expect(invoice.forgiven).to.equal(stripe_invoice.forgiven);
        //expect(invoice.next_payment_attempt).to.equal(stripe_invoice.next_payment_attempt);
        expect(invoice.paid).to.equal(stripe_invoice.paid);
        //expect(invoice.period_end).to.equal(stripe_invoice.period_end);
        //expect(invoice.period_start).to.equal(stripe_invoice.period_start);
        expect(invoice.statement_descriptor).to.equal(stripe_invoice.statement_descriptor);
        //expect(invoice.subscription).to.equal(subscription);
        expect(invoice.subtotal).to.equal(stripe_invoice.subtotal);
        expect(invoice.tax).to.equal(stripe_invoice.tax);
        expect(invoice.tax_percent).to.equal(stripe_invoice.tax_percent);
        expect(invoice.total).to.equal(stripe_invoice.total);

        done(err);
      });
    });
  });
});
