var expect        = require('chai').expect;
var async         = require("async");
var factory       = require('factory-girl');
var request       = require('supertest');
var app           = require('../server');
var security      = require('../security');

var Account   = require("../models/account.js");

var UserFactory   = require("../test/factories/user.factory.js");
var PlanFactory   = require("../test/factories/plan.factory.js");
var BeforeHooks   = require("../test/hooks/before.hooks.js");
var AfterHooks    = require("../test/hooks/after.hooks.js");

describe("Plans API Endpoint", function() {
  var bull = null;
  var bull_user = null;
  var json_web_token = null;

  beforeEach(function(done) {
    async.waterfall([
      function openConnection(callback) {
        BeforeHooks.SetupDatabase(callback)
      },
      function createAccount(callback) {
        factory.create('account', function(err, account) {
          bull = account;

          callback();
        });
      },
      function createUser(callback) {
        factory.create('bull', function(err, user) {
          user.account = bull
          user.save(function(err) {
            if(err) { console.log(err); }

            bull_user = user;

            security.generate_token(bull_user, process.env.SECRET, function(err, token) {
              if(err) { console.log(err); }

              json_web_token = token;

              callback(err)
            });
          });
        });
      }
    ], function(err) {
      done(err);
    });
  });
  afterEach(function(done) {
    AfterHooks.CleanUpDatabase(function(err) {
      done(err);
    });
  });
  describe("Get Plans", function() {
    it('returns all plans', function(done) {
      factory.createMany('plan', {}, 35, { "account": bull },  function(err, plans) {
        request(app)
        .get('/api/plans')
        .set('x-access-token', json_web_token)
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an('object');
          expect(res.body.results).to.be.an('array')
          expect(res.body.results).to.have.length(10);
          expect(res.body.total).to.equal(35);
          expect(res.body.limit).to.equal(10);
          expect(res.body.max_pages).to.equal(4);

          done();
        });
      });
    });
    it('paginates second page of results when passing page=2 in querystring', function(done) {
      factory.createMany('plan', {}, 35, { "account": bull },  function(err, plans) {
        request(app)
        .get('/api/plans?page=2')
        .set('x-access-token', json_web_token)
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an('object');
          expect(res.body.results).to.be.an('array')
          expect(res.body.results).to.have.length(10);
          expect(res.body.offset).to.equal(10);

          done();
        });
      });
    });
    it('paginates third page of results when passing page=3 in querystring', function(done) {
      factory.createMany('plan', {}, 35, { "account": bull },  function(err, plans) {
        request(app)
        .get('/api/plans?page=3')
        .set('x-access-token', json_web_token)
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an('object');
          expect(res.body.results).to.be.an('array')
          expect(res.body.results).to.have.length(10);
          expect(res.body.offset).to.equal(20);

          done();
        });
      });
    });
    it('paginates forth page of results when passing page=4 in querystring', function(done) {
      factory.createMany('plan', {}, 35, { "account": bull },  function(err, plans) {
        request(app)
        .get('/api/plans?page=4')
        .set('x-access-token', json_web_token)
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an('object');
          expect(res.body.results).to.be.an('array')
          expect(res.body.results).to.have.length(5);
          expect(res.body.offset).to.equal(30);

          done();
        });
      });
    });
  });
  describe("Get Plan", function() {
    it('returns a plan', function(done) {
      factory.createMany('plan', {}, 35, { "account": bull },  function(err, plans) {
        var plan = plans[2];

        request(app)
        .get('/api/plans/' + plan._id)
        .set('x-access-token', json_web_token)
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an('object');
          expect(res.body.name).to.equal(plan.name);

          done();
        });
      });
    });
    it('returns a 404 if plan is not found', function(done) {
      factory.createMany('plan', {}, 35, { "account": bull },  function(err, plans) {
        request(app)
        .get('/api/plans/587d092b6b16cf17b630205b')
        .set('x-access-token', json_web_token)
        .expect(404)
        .then((res) => {
          expect(res.body).to.be.an('object');

          done();
        });
      });
    });
  });
  describe("Create Plan", function() {
    it('returns a new plan', function(done) {
      var new_plan = {
        "name": "Test Plan ABC",
        "description": "Best test plan for all",
        "features": ["Feature 1", "Feature 2"],
        "amount": 100,
        "currency": "usd",
        "interval": 1,
        "interval_count": 3,
        "statement_descriptor": "Best Test Plan",
        "trial_period_days": 0,
        "statement_description": "This is the statement descriptor",
        "terms_of_service": "Terms of Service"
      }
      request(app)
      .post('/api/plans/')
      .set('x-access-token', json_web_token)
      .send(new_plan)
      .expect(201)
      .then((res) => {
        var plan = res.body;
        expect(res.body).to.be.an('object');
        expect(res.body.name).to.equal(new_plan.name);
        expect(res.body.description).to.equal(new_plan.description);
        expect(res.body.description).to.equal(new_plan.description);
        expect(res.body.one_time_amount).to.equal(new_plan.one_time_amount);
        expect(res.body.statement_descriptor).to.equal(new_plan.statement_descriptor);
        expect(res.body.trial_period_days).to.equal(new_plan.trial_period_days);
        expect(res.body.statement_description).to.equal(new_plan.statement_description);
        expect(res.body.terms_of_service).to.equal(new_plan.terms_of_service);

        done();
      });
    });
  });
  describe("Update Plan", function() {
    it('returns a plan', function(done) {
      factory.createMany('plan', {}, 35, { "account": bull },  function(err, plans) {
        var plan = plans[2];
        var plan_updates = {
          "name": plan.name + " updated",
          "description": plan.description + " updated",
          "features": ['Feature 1', 'Feature 2'],
          "one_time_amount": 101,
          //"statement_descriptor": plan.statement_descriptor + " updated",
          "trial_period_days": 6,
          //"statement_description": plan.statement_description + " updated",
          "terms_of_service": plan.terms_of_service + " updated"
        }
        request(app)
        .put('/api/plans/' + plan._id)
        .set('x-access-token', json_web_token)
        .send(plan_updates)
        .expect(200)
        .then((res) => {
          console.log(res.body);

          expect(res.body).to.be.an('object');
          expect(res.body.name).to.equal(plan_updates.name);
          expect(res.body.description).to.equal(plan_updates.description);
          expect(res.body.features).to.be.an('array');
          expect(res.body.one_time_amount).to.equal(plan_updates.one_time_amount);
          expect(res.body.statement_descriptor).to.equal(plan_updates.statement_descriptor);
          expect(res.body.trial_period_days).to.equal(plan_updates.trial_period_days);
          expect(res.body.statement_description).to.equal(plan_updates.statement_description);
          expect(res.body.terms_of_service).to.equal(plan_updates.terms_of_service);

          done();
        });
      });
    });
  });
});
