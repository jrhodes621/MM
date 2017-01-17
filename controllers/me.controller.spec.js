var expect        = require('chai').expect;
var async         = require("async");
var factory       = require('factory-girl');
var request       = require('supertest');
var app           = require('../server');
var security      = require('../security');

var UserFactory   = require("../test/factories/user.factory.js");
var BeforeHooks   = require("../test/hooks/before.hooks.js");
var AfterHooks    = require("../test/hooks/after.hooks.js");

describe("Me API Endpoint", function() {
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
  describe("Get User", function() {
    it('should return a 200 when session is valid', function(done) {
      let user = factory.buildSync('user');

      user.save(function(err) {
        if(err) { console.log(err); }

        security.generate_token(user, process.env.SECRET, function(err, token) {
          request(app)
          .get('/api/me')
          .set('x-access-token', token)
          .expect(200)
          .then((res) => {
            expect(res.body).to.be.an('object');

            done(err);
          });
        });
      });
    })
    it('should return a 403 when session is invalid', function(done) {
      let user = factory.buildSync('user');

      user.save(function(err) {
        if(err) { console.log(err); }

        security.generate_token(user, process.env.SECRET, function(err, token) {
          var bad_token = "abc";

          request(app)
          .get('/api/me')
          .set('x-access-token', bad_token)
          .expect(403)
          .then((res) => {
            expect(res.body).to.be.an('object');

            done(err);
          });
        });
      });
    })
    it('should return a User when session is valid', function(done) {
      let user = factory.buildSync('user');

      user.save(function(err) {
        if(err) { console.log(err); }

        security.generate_token(user, process.env.SECRET, function(err, token) {
          request(app)
          .get('/api/me')
          .set('x-access-token', token)
          .expect(200)
          .then((res) => {
            expect(res.body.email_address).to.equal(user.email_address);

            done(err);
          });
        });
      });
    })
  });
});
