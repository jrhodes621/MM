var expect                = require("chai").expect;
var mongoose              = require("mongoose");
var async                 = require('async');

var AccountFixtures           = require("../../test/fixtures/account.fixtures.js");
var ChargeFixtures            = require("../../test/fixtures/charge.fixtures.js");
var ChargeDisputeFixtures     = require("../../test/fixtures/charge_dispute.fixtures.js");
var InvoiceFixtures           = require("../../test/fixtures/invoice.fixtures.js");
var MembershipFixtures        = require("../../test/fixtures/membership.fixtures.js");
var PaymentCardFixtures       = require("../../test/fixtures/payment_card.fixtures.js");
var UserFixtures              = require("../../test/fixtures/user.fixtures.js");
var BeforeHooks               = require("../../test/hooks/before.hooks.js");
var AfterHooks                = require("../../test/hooks/after.hooks.js");

var InvoiceParser             = require("../../parsers/stripe/invoice_parser");

describe("Invoice Parser", () => {
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
  describe("Parse Invoice", () => {
    it("parses a Invoice JSON object into a invoice object", (done) => {
      InvoiceParser.parse(bull, InvoiceFixtures.StripeInvoice, membership, function(err, invoice) {
        if(err) { console.log(err); }
        //expect(charge.card_info).to.equal(stripe_charge.card_info);
        //expect(invoice.membership).to.equal(membership);
        expect(invoice.reference_id).to.equal(InvoiceFixtures.StripeInvoice.id);
        expect(invoice.amount_due).to.equal(InvoiceFixtures.StripeInvoice.amount_due);
        expect(invoice.application_fee).to.equal(InvoiceFixtures.StripeInvoice.application_fee);
        expect(invoice.attempt_count).to.equal(InvoiceFixtures.StripeInvoice.attempt_count);
        expect(invoice.attempted).to.equal(InvoiceFixtures.StripeInvoice.attempted);
        //expect(invoice.charge).to.equal(charge);
        expect(invoice.closed).to.equal(InvoiceFixtures.StripeInvoice.closed);
        expect(invoice.currency).to.equal(InvoiceFixtures.StripeInvoice.currency);
        //expect(invoice.invoice_date).to.equal(stripe_invoice.date);
        expect(invoice.description).to.equal(InvoiceFixtures.StripeInvoice.description);
        //expect(invoice.discount).to.equal(discount);
        expect(invoice.ending_balance).to.equal(InvoiceFixtures.StripeInvoice.ending_balance);
        expect(invoice.forgiven).to.equal(InvoiceFixtures.StripeInvoice.forgiven);
        //expect(invoice.next_payment_attempt).to.equal(stripe_invoice.next_payment_attempt);
        expect(invoice.paid).to.equal(InvoiceFixtures.StripeInvoice.paid);
        //expect(invoice.period_end).to.equal(stripe_invoice.period_end);
        //expect(invoice.period_start).to.equal(stripe_invoice.period_start);
        expect(invoice.statement_descriptor).to.equal(InvoiceFixtures.StripeInvoice.statement_descriptor);
        //expect(invoice.subscription).to.equal(subscription);
        expect(invoice.subtotal).to.equal(InvoiceFixtures.StripeInvoice.subtotal);
        expect(invoice.tax).to.equal(InvoiceFixtures.StripeInvoice.tax);
        expect(invoice.tax_percent).to.equal(InvoiceFixtures.StripeInvoice.tax_percent);
        expect(invoice.total).to.equal(InvoiceFixtures.StripeInvoice.total);

        done(err);
      });
    });
  });
});
