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

describe("Plan Activities API Endpoint", function() {
  beforeEach(function(done) {
    done();
  });
  afterEach(function(done) {
    done();
  });
  describe("Get Activities", function() {
    it('should return 200 when successful', function(done) {
      done(new Error("Not Implemented"));
    });
    it('should return activities grouped by dates desc', function(done) {
      done(new Error("Not Implemented"));
    });
    it('should return activities in each grouped sorted by time desc', function(done) {
      done(new Error("Not Implemented"));
    });
    it('should only return activities for the specified plan', function(done) {
      done(new Error("Not Implemented"));
    });
    it('should return an 403 error if the current user does not own the specified plan', function(done) {
      done(new Error("Not Implemented"));
    });
    it('should return an error if the token is not valid', function(done) {
      done(new Error("Not Implemented"));
    });
  });
});
