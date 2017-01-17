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

describe("Funnel API Endpoint", function() {
  beforeEach(function(done) {
    done();
  });
  afterEach(function(done) {
    done();
  });
  describe("Step 1", function() {

  });
  describe("Step 2", function() {

  });
  describe("Step 3", function() {

  });
});
