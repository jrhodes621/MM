var Account               = require("../models/account");
var Charge                = require("../models/charge");
var ChargeDispute         = require("../models/charge_dispute");
var Membership            = require("../models/membership");
var PaymentCard           = require("../models/payment_card");
var User                  = require("../models/user");
var ChargeDisputeParser   = require("../parsers/stripe/charge_dispute_parser");

var StripeImportProcessor     = require('../helpers/stripe_import_processor');
var expect                    = require("chai").expect;
var mongoose                  = require("mongoose");
var async                     = require('async');

var AccountFixtures           = require("../test/fixtures/account.fixtures.js");
var BeforeHooks               = require('../test/hooks/before.hooks.js');
var AfterHooks                = require('../test/hooks/after.hooks.js');

var StripeServices            = require('../services/stripe.services');

describe("Stripe Import Processor", () => {
  var bull = null;
  var number_of_plans = null;
  var number_of_subscriptions = null;
  var number_of_charges = null;
  var number_of_coupons = null;
  var number_of_invoices = null;

  beforeEach((done) =>{
    async.waterfall([
      function openConnection(callback) {
        BeforeHooks.SetupDatabase(callback)
      },
      function addBull(callback) {
        BeforeHooks.SetupBull(AccountFixtures.bull, function(err, account) {
          bull = account;

          callback(err);
        });
      }
    ], (err) => {
      done(err);
    });
  })
  afterEach((done) =>{
    AfterHooks.CleanUpDatabase((err) => {
      done(err);
    });
  });
  describe("Import Account", () => {
    this.timeout(600000);

    it("should import from stripe", (done) => {
      StripeImportProcessor.processImport(bull, function(err,  plans, subscriptions, charges, coupons, invoices) {
        if(err) { console.log(err); }

        expect(number_of_plans).to.equal(plans.length);
        expect(number_of_subscriptions).to.equal(subscriptions.length);
        expect(number_of_charges).to.equal(charges.length);
        expect(number_of_coupons).to.equal(coupons.length);
        expect(number_of_invoices).to.equal(invoices.length);

        done(err);
      });
    });
  });
});
