var expect        = require('chai').expect;
var async         = require("async");
var factory       = require('factory-girl');
var request       = require('supertest');
var app           = require('../server');
var security      = require('../security');

var UserFactory   = require("../test/factories/user.factory.js");
var BeforeHooks   = require("../test/hooks/before.hooks.js");
var AfterHooks    = require("../test/hooks/after.hooks.js");

var User = require('../models/user');

describe("User Payment Cards API Endpoint", function() {
  var user = null;

  beforeEach(function(done) {
    async.waterfall([
      function openConnection(callback) {
        BeforeHooks.SetupDatabase(callback)
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
  describe("Create Payment Card", function() {
    it('should return a 201 when succeeds', function(done) {
      request(app)
      .post('/api/user_payment_cards')
      .send({
        "stripe_token": "",
      })
      .expect(201)
      .then((res) => {
        expect(res.body).to.be.an('object');

        done();
      });
    });
    it('should return a 404 if user is not member of bull', function(done) {
      done(new Error("Not Implemented"));
    });
    it('should create new payment card', function(done) {
      done(new Error("Not Implemented"));
    });
    it('should create card in Stripe', function(done) {
      done(new Error("Not Implemented"));
    });
    it('should return 403 if bull is not connected to Stripe', function(done) {
      done(new Error("Not Implemented"));
    });
  });
});
