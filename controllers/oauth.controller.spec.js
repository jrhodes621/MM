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

describe("OAuth API Endpoint", function() {
  beforeEach(function(done) {
    done();
  });
  afterEach(function(done) {
    done();
  });
  describe("Stripe OAuth Callback", function() {
    it('should return 200 when valid code and state is password in Stripe callback', function(done) {
      done(new Error("Not Implemented"));
    }),
    it('should return an error is a User is not found', function(done) {
      done(new Error("Not Implemented"));
    });
    it('should save a Stripe Connect json object to the user', function(done) {
      done(new Error("Not Implemented"));
    })
    it('should redirect user to the dashboard plan page', function(done) {
      done(new Error("Not Implemented"));
    });
    it('should return an error if the query does not contain a code and state', function(done) {
      done(new Error("Not Implemented"));  
    });
  });
});
