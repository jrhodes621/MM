var expect                = require("chai").expect;
var mongoose              = require("mongoose");
var async                 = require('async');

var AccountFixtures           = require("../../test/fixtures/account.fixtures.js");
var PlanFixtures              = require("../../test/fixtures/plan.fixtures.js");
var BeforeHooks               = require("../../test/hooks/before.hooks.js");
var AfterHooks                = require("../../test/hooks/after.hooks.js");

var PlanParser            = require("../../parsers/stripe/plan_parser");

describe("Plan Parser", () => {
  var bull = null;

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
  describe("Parse Stripe Plan", () => {
    it("parses a Stripe Plan JSON object into a plan object", (done) => {
      PlanParser.parse(bull, PlanFixtures.StripePlan, function(err, plan) {
        //expect(mongoose.Schema.Types.ObjectId(plan.user._id)).to.equal(mongoose.Schema.Types.ObjectId(user._id));
        expect(plan.name).to.equal(PlanFixtures.StripePlan.name);
        expect(plan.reference_id).to.equal(PlanFixtures.StripePlan.id);
        expect(plan.amount).to.equal(PlanFixtures.StripePlan.amount/100);
        //expect(plan.interval).to.equal(PlanFixtures.StripePlan.interval);
        expect(plan.interval_count).to.equal(PlanFixtures.StripePlan.interval_count);
        expect(plan.statement_description).to.equal(PlanFixtures.StripePlan.status_description);
        expect(plan.archive).to.equal(false);

        done(err);
      });
    });
  });
});
