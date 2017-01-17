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

describe("Activities API Endpoint", function() {
  var bull = null;
  var bull_user = null;
  var json_web_token = null;

  var other_bull = null;

  beforeEach(function(done) {
    async.waterfall([
      function openConnection(callback) {
        BeforeHooks.SetupDatabase(callback)
      },
      function createBull(callback) {
        factory.create('account', function(err, account) {
          bull = account;

          callback();
        });
      },
      function createOther(callback) {
        factory.create('account', function(err, account) {
          other_bull = account;

          callback();
        });
      },
      function createUser(callback) {
        factory.create('bull', function(err, user) {
          user.account = bull
          user.save(function(err) {
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
  afterEach(function(done){
    AfterHooks.CleanUpDatabase(function(err) {
      done(err);
    });
  });
  describe("Get Activities", function() {
    it('should return array of activities grouped by date', function(done) {
      done(new Error("Not Implemented"));
    });
    it('should only return activities for the current bull', function(done) {
      done(new Error("Not Implemented"));
    });
    it('should return a 200 when succeeds', function(done) {
      done(new Error("Not Implemented"));
    });
    it('should return 404 if calf is not member of bull', function(done) {
      done(new Error("Not Implemented"));
    });
  });
});
