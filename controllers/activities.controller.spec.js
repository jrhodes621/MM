var expect        = require('chai').expect;
var async         = require("async");
var factory       = require('factory-girl');
var request       = require('supertest');
var app           = require('../server');
var security      = require('../security');
var faker         = require('faker');

var ActivityFactory   = require("../test/factories/activity.factory.js");
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
    it('should return a 200 when succeeds', function(done) {
      let user = factory.buildSync('user');

      user.save(function(err) {
        if(err) { done(err); }

        factory.createMany('activity', {}, 35,
          { "bull": bull,
            "calf": user,
            "type": "test activity",
            "message_calf": "Message Calf",
            "message_bull": "Message Bull"
          }, function(err, activities) {
          request(app)
          .get('/api/activities')
          .set('x-access-token', json_web_token)
          .expect(200)
          .then((res) => {
            console.log(res.body);
            expect(res.body).to.be.an('array');
            //expect(res.body[0].date_group).to.be.a('date');
            expect(res.body[0].activities).to.be.an('array');

            done();
          });
        });
      });
    });
    it('should return array of activities grouped by date', function(done) {
      done(new Error("Not Implemented"));
    });
    it('should only return activities for the current bull', function(done) {
      done(new Error("Not Implemented"));
    });
    it('should return activities sorted by create date asc', function(done) {

    });
  });
});
