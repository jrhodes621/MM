var expect        = require('chai').expect;
var async         = require("async");
var factory       = require('factory-girl');
var request       = require('supertest');
var app           = require('../server');
var security      = require('../security');
var faker         = require('faker');

var User  = require('../models/user');

var UserFactory   = require("../test/factories/user.factory.js");
var BeforeHooks   = require("../test/hooks/before.hooks.js");
var AfterHooks    = require("../test/hooks/after.hooks.js");

describe("Members API Endpoint", function() {
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
  describe("Get Members", function() {
    it('should return a 200 when successfull', function(done) {
      factory.createMany('membership', {}, 3, { "bull": bull, }, function(err, memberships) {
          console.log(memberships);
          User.find({}, function(err, users) {
            console.log(users);

        request(app)
        .get('/api/members')
        .set('x-access-token', json_web_token)
        .expect(200)
        .then((res) => {
          console.log(res.body);
          expect(res.body).to.be.an('object');
          //expect(res.body[0].date_group).to.be.a('date');
          //expect(res.body[0].activities).to.be.an('array');
          //expect(res.body[0].activities).to.have.length(35);

          done();
        });
        });
      //});
    });
    it('should return an array of members', function(done) {
      // factory.createMany('member', {}, 35,
      //   { "bull": bull,
      //     "calf": user,
      //     "type": "test activity",
      //     "message_calf": "Message Calf",
      //     "message_bull": "Message Bull"
      //   }, function(err, activities) {
      //     console.log(err);
        request(app)
        .get('/api/members')
        .set('x-access-token', json_web_token)
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an('array');
          //expect(res.body[0].date_group).to.be.a('date');
          //expect(res.body[0].activities).to.be.an('array');
          //expect(res.body[0].activities).to.have.length(35);

          done();
        });
      });
    });
  });
});
