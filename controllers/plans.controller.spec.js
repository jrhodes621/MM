var chai = require('chai');
var expect = chai.expect;

var http_mocks = require('node-mocks-http');
var mockery = require('mockery');
var mongoose = require('mongoose');

var Account = require('../models/account');
var User = require('../models/user');

var PlanFixtures = require('../fixtures/plan.fixtures')
var PlanServicesMock = require('../models/plan.services.mock');

function buildResponse() {
  return http_mocks.createResponse({eventEmitter: require('events').EventEmitter})
}
function next(err) {
  console.log(err);
}

var user = {
  "status": "Active",
  "email_address": "james@membermoose.com",
  "password": "mm1234",
}
var account = {
  company_name: "Membermoose",
  subdomain: "membermoose",
  status: "active"
}

var current_user = new User(user)
current_user.account = new Account(account);

describe("Plans API Endpoint", function() {
  beforeEach(function(done) {
    mockery.enable({
      warnOnReplace: true,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    mockery.registerMock('../models/plan.services', PlanServicesMock);

    this.controller = require('../controllers/plans.controller');

    done();
  });
  afterEach(function(done) {
    mockery.disable();

    done();
  });
  describe("Get Plans", function() {
    it('returns all plans', function(done) {
      var response = buildResponse()
      var request  = http_mocks.createRequest({
        method: 'GET',
        url: '/plans',
        current_user: current_user
      })

      response.on('end', function() {
        var data = JSON.parse(response._getData());

        expect(data.results).to.have.lengthOf(PlanFixtures.paginated_results.plans.length);
        expect(data.total).to.equal(PlanFixtures.paginated_results.total);
        expect(data.limit).to.equal(PlanFixtures.paginated_results.limit);
        expect(data.offset).to.equal(PlanFixtures.paginated_results.offset);
        expect(data.max_pages).to.equal(PlanFixtures.paginated_results.max_pages);

        done();
      });

      this.controller.GetPlans(request, response, next);
    });
  });
  describe("Get Plan", function() {
    it('returns a plan', function(done) {
      var response = buildResponse()
      var request  = http_mocks.createRequest({
        method: 'GET',
        url: '/plans/586da9eb4cec8e8176f190ce',
        current_user: current_user
      });

      response.on('end', function() {
        var plan = response._getData();

        expect(plan._id).to.equal(PlanFixtures.plan._id);
        expect(plan.name).to.equal(PlanFixtures.plan.name);
        expect(plan.member_count).to.equal(PlanFixtures.plan.member_count);
        //expect(plan.features)
        expect(plan.archive).to.equal(PlanFixtures.plan.archive);
        expect(plan.reference_id).to.equal(PlanFixtures.plan.reference_id);
        //expect(plans.user)
        expect(plan.amount).to.equal(PlanFixtures.plan.amount);
        expect(plan.interval).to.equal(PlanFixtures.plan.interval);
        expect(plan.interval_count).to.equal(PlanFixtures.plan.interval_count);
        expect(plan.statement_descriptor).to.equal(PlanFixtures.plan.statement_descriptor);
        expect(plan.created_at).to.equal(PlanFixtures.plan.created_at);
        expect(plan.updated_at).to.equal(PlanFixtures.plan.updated_at);

        done();
      });

      this.controller.GetPlan(request, response, next);
    });
  });
  describe("Create Plan", function() {
    it('returns a plan', function(done) {
      var response = buildResponse()
      var request  = http_mocks.createRequest({
        method: 'POST',
        url: '/plans',
        current_user: current_user,
        body: {
          "name": PlanFixtures.new_plan.name,
          "description": PlanFixtures.new_plan.descriptions,
          "features": PlanFixtures.new_plan.features,
          "amount": PlanFixtures.new_plan.amount,
          "interval": PlanFixtures.new_plan.interval,
          "interval_count": PlanFixtures.new_plan.interval_count,
          "statement_descriptor": PlanFixtures.new_plan.statement_descriptor,
          "trial_period_days": PlanFixtures.new_plan.trial_period_days,
          "statement_description": PlanFixtures.new_plan.statement_description,
          "terms_of_service": PlanFixtures.new_plan.terms_of_service
        }
      });

      response.on('end', function() {
        var plan = response._getData();

        expect(plan.name).to.equal(PlanFixtures.new_plan.name);
        expect(plan.member_count).to.equal(PlanFixtures.new_plan.member_count);
        //expect(plan.features)
        expect(plan.archive).to.equal(PlanFixtures.new_plan.archive);
        //expect(plans.user)
        expect(plan.amount).to.equal(PlanFixtures.new_plan.amount);
        expect(plan.interval).to.equal(PlanFixtures.new_plan.interval);
        expect(plan.interval_count).to.equal(PlanFixtures.new_plan.interval_count);
        expect(plan.statement_descriptor).to.equal(PlanFixtures.new_plan.statement_descriptor);
        expect(plan.created_at).to.equal(PlanFixtures.new_plan.created_at);
        expect(plan.updated_at).to.equal(PlanFixtures.new_plan.updated_at);

        done();
      });

      this.controller.CreatePlan(request, response, next);
    });
  });
  describe("Update Plan", function() {
    it('returns a plan', function(done) {
      var response = buildResponse()
      var request  = http_mocks.createRequest({
        method: 'PUT',
        url: '/plans/586da9eb4cec8e8176f190ce',
        current_user: current_user,
        plan: PlanFixtures.paginated_results.plans[2],
        params: {
          plan_id: "586da9eb4cec8e8176f190ce"
        },
        body: {
          "name": PlanFixtures.updated_plan.name,
          "description": PlanFixtures.updated_plan.description,
          "features": PlanFixtures.updated_plan.features,
          "amount": PlanFixtures.updated_plan.amount,
          "interval": PlanFixtures.updated_plan.interval,
          "interval_count": PlanFixtures.updated_plan.interval_count,
          "statement_descriptor": PlanFixtures.updated_plan.statement_descriptor,
          "trial_period_days": PlanFixtures.updated_plan.trial_period_days,
          "statement_description": PlanFixtures.updated_plan.statement_description,
          "terms_of_service": PlanFixtures.updated_plan.terms_of_service
        }
      });

      response.on('end', function() {
        var plan = response._getData();

        expect(plan._id).to.equal(PlanFixtures.paginated_results.plans[2]._id);
        expect(plan.name).to.equal(PlanFixtures.updated_plan.name);
        expect(plan.member_count).to.equal(PlanFixtures.paginated_results.plans[2].member_count);
        //expect(plan.features)
        expect(plan.archive).to.equal(PlanFixtures.paginated_results.plans[2].archive);
        expect(plan.reference_id).to.equal(PlanFixtures.paginated_results.plans[2].reference_id);
        //expect(plans.user)
        expect(plan.amount).to.equal(PlanFixtures.paginated_results.plans[2].amount);
        expect(plan.interval).to.equal(PlanFixtures.updated_plan.interval);
        expect(plan.interval_count).to.equal(PlanFixtures.updated_plan.interval_count);
        expect(plan.statement_descriptor).to.equal(PlanFixtures.updated_plan.statement_descriptor);
        expect(plan.created_at).to.equal(PlanFixtures.paginated_results.plans[2].created_at);
        expect(plan.updated_at).to.equal(PlanFixtures.paginated_results.plans[2].updated_at);

        done();
      });

      this.controller.UpdatePlan(request, response, next);
    });
  });
});
