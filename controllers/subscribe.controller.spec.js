var expect        = require('chai').expect;
var async         = require("async");
var factory       = require('factory-girl');
var request       = require('supertest');
var app           = require('../server');
var security      = require('../security');

var UserFactory   = require("../test/factories/user.factory.js");
var PlanFactory   = require("../test/factories/plan.factory.js");
var BeforeHooks   = require("../test/hooks/before.hooks.js");
var AfterHooks    = require("../test/hooks/after.hooks.js");

var User = require('../models/user');

describe("Subscribe API Endpoint", function() {
  var user = null;
  var bull = null;

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
      }
    ], function(err) {
      done(err);
    });
  });
  afterEach(function(done){
    AfterHooks.CleanUpDatabase(function(err) {
      done(err);
    });
  });
  describe("Create Subscription", function() {
    it('should create a new subscription', function(done) {
      factory.create('plan', {}, { "account": bull },  function(err, plan) {
        if(err) { done(err); }

        var params = {
          "plan_id": plan.id,
          "email_address": "test1@demo.com",
          "password": "test123",
          "first_name": "James",
          "last_name": "Rhodes"
        }
        request(app)
        .post('/api/accounts/' + bull.subdomain + '/subscribe')
        .send(params)
        .expect(201)
        .then((res) => {
          var subscription = res.body;
          console.log(res.body);
          expect(res.body).to.be.an('object');

          done();
        });
      });
    });
  });
});
