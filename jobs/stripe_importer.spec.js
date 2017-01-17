var Account               = require("../../models/account");
var Charge                = require("../../models/charge");
var ChargeDispute         = require("../../models/charge_dispute");
var Membership            = require("../../models/membership");
var PaymentCard           = require("../../models/payment_card");
var User                  = require("../../models/user");
var ChargeDisputeParser   = require("../../parsers/stripe/charge_dispute_parser");

var StripeImportProcessor     = require('../helpers/stripe_import_processor');

var AccountFixtures           = require("../test/fixtures/account.fixtures.js");
var BeforeHooks               = require("../test/hooks/before.hooks.js");
var AfterHooks                = require("../test/hooks/after.hooks.js");

var expect                    = require("chai").expect;
var mongoose                  = require("mongoose");
var async                     = require("async");

describe("Stripe Import Processor", function() {
  var bull = null;

  beforeEach(function(done){
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
    ], function(err) {
      done(err);
    });
  })
  afterEach(function(done){
    AfterHooks.CleanUpDatabase(function(err) {
      done(err);
    });
  });
  describe("Import", function() {
    it("imports from stripe", function(done) {
      StripeImportProcessor.import(bull, function(err, user, plans, charges) {
        if(err) { console.log(err); }

        done(err);
      });
    });
  });
});
