var expect        = require('chai').expect;
var async         = require("async");
var factory       = require('factory-girl');
var request       = require('supertest');
var app           = require('../server');
var security      = require('../security');
var faker         = require('faker');

var UserFactory   = require("../test/factories/user.factory.js");
var BeforeHooks   = require("../test/hooks/before.hooks.js");
var AfterHooks    = require("../test/hooks/after.hooks.js");

describe("On Boarding API Endpoint", function() {
  beforeEach(function(done) {
    done();
  });
  afterEach(function(done) {
    done();
  });
  describe("Connect Stripe", function() {
    it('should return a 200 when successful', function(done) {
      done(new Error("Not Implemented"));
    });
    it('should return the sign in user', function(done) {
      done(new Error("Not Implemented"));
    });
    it('should save the Stripe connect information to the user', function(done) {
      done(new Error("Not Implemented"));
    });
    it('should save the account_id returned by Stripe in the reference_id of the user', function(done) {
      done(new Error("Not Implemented"));
    });
    it('should return an error if the json web token is invalid', function(done) {
      done(new Error("Not Implemented"));
    });
  });
});
