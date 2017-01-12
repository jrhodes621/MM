var expect                = require("chai").expect;
var Account               = require("../../models/account");
var Plan                  = require("../../models/plan");
var PlanParser            = require("../../parsers/stripe/plan_parser");
var mongoose              = require("mongoose");
var async                 = require("async");

var stripe_plan = {
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
}

describe("Plan Parser", function() {
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
      }
    ], function(err) {
      done(err);
    });
  });
  afterEach(function(done) {
    async.waterfall([
      function removeAccounts(callback) {
        Account.remove({}, function() {
          callback();
        });
      },
      function removePlans(callback) {
        Plan.remove({}, function() {
          callback();
        });
      }
    ], function(err) {
      mongoose.connection.close();

      done(err);
    })
  });
  describe("Parse Stripe Plan", function() {
    it("parses a Stripe Plan JSON object into a plan object", function(done) {
      PlanParser.parse(bull, stripe_plan, function(err, plan) {
        //expect(mongoose.Schema.Types.ObjectId(plan.user._id)).to.equal(mongoose.Schema.Types.ObjectId(user._id));
        expect(plan.name).to.equal(stripe_plan.name);
        expect(plan.reference_id).to.equal(stripe_plan.id);
        expect(plan.amount).to.equal(stripe_plan.amount/100);
        //expect(plan.interval).to.equal(stripe_plan.interval);
        expect(plan.interval_count).to.equal(stripe_plan.interval_count);
        expect(plan.statement_description).to.equal(stripe_plan.status_description);
        expect(plan.archive).to.equal(false);

        done(err);
      });
    });
  });
});
