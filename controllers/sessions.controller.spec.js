var expect        = require('chai').expect;
var async         = require("async");
var factory       = require('factory-girl');
var request       = require('supertest');
var app           = require('../server');
var security      = require('../security');

var UserFactory   = require("../test/factories/user.factory.js");
var BeforeHooks   = require("../test/hooks/before.hooks.js");
var AfterHooks    = require("../test/hooks/after.hooks.js");

describe("Sessions API Endpoint", function() {
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
  describe("Create Session", function() {
    it('should return 200 when credentials are valid', function(done) {

      let user = factory.buildSync('user');

      user.save(function(err) {
        if(err) { console.log(err); }

        request(app)
        .post('/api/sessions')
        .send(
          {
            email_address: user.email_address,
            password: "test123"
          }
        )
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an('object');

          done(err);
        });
      });
    });
  });
  //   it('should return token and refesh_token when credentials are valid', function(done) {
  //     var response = buildResponse()
  //     var request  = http_mocks.createRequest({
  //       method: 'POST',
  //       url: '/sessions',
  //       body: {
  //         email_address: "james@somehero.com",
  //         password: "test123"
  //       }
  //     });
  //
  //     response.on('end', function() {
  //       var data = JSON.parse(response._getData());
  //
  //       expect(data).to.have.property('success');
  //       expect(data).to.have.property("token");
  //       expect(data).to.have.property("refresh_token");
  //       expect(data).to.have.property("user_id");
  //
  //       done();
  //     });
  //
  //     this.controller.CreateSession(request, response, next);
  //   });
  //   it('should persist the refresh_token', function(done) {
  //     var response = buildResponse()
  //     var request  = http_mocks.createRequest({
  //       method: 'POST',
  //       url: '/sessions',
  //       body: {
  //         email_address: "james@somehero.com",
  //         password: "test123"
  //       }
  //     });
  //
  //     response.on('end', function() {
  //       var data = JSON.parse(response._getData());
  //
  //       User.GetUserById(user.id, function(err, user) {
  //         expect(user.refresh_token).to.equal(data.refresh_token);
  //         done();
  //       });
  //     });
  //
  //     this.controller.CreateSession(request, response, next);
  //   });
  //   it('should return 403 and 1004 minor code when both email_address and password are invalid', function(done) {
  //     var response = buildResponse()
  //     var request  = http_mocks.createRequest({
  //       method: 'POST',
  //       url: '/sessions',
  //       body: {
  //         email_address: "james@email.com",
  //         password: "badpassword"
  //       }
  //     });
  //
  //     response.on('end', function() {
  //       var data = response._getData();
  //
  //       expect(response.statusCode).to.equal(403);
  //       expect(data.minor_code).to.equal(1004);
  //
  //       done();
  //     });
  //
  //     this.controller.CreateSession(request, response, next);
  //   });
  //   it('should return 403 and 1005 minor code when email_address is valid and password is invalid', function(done) {
  //     var response = buildResponse()
  //     var request  = http_mocks.createRequest({
  //       method: 'POST',
  //       url: '/sessions',
  //       body: {
  //         email_address: "james@somehero.com",
  //         password: "badpassword"
  //       }
  //     });
  //
  //     response.on('end', function() {
  //       var data = response._getData();
  //
  //       expect(response.statusCode).to.equal(403);
  //       expect(data.minor_code).to.equal(1005);
  //
  //       done();
  //     });
  //
  //     this.controller.CreateSession(request, response, next);
  //   });
  // });
  // describe("Refresh Session", function() {
  //   it('should return 200 if refresh token is valid', function(done) {
  //
  //   });
  //   it('should return token and new refesh_token when refresh token is valid', function(done) {
  //
  //   });
  //   it('should persist refresh token in db', function(done) {
  //
  //   });
  //   it('should return 403 with minor code 1006 if refresh token is not valid', function(done) {
  //     var response = buildResponse()
  //     var request  = http_mocks.createRequest({
  //       method: 'POST',
  //       url: '/sessions/verify',
  //       body: {
  //         refresh_token: "1234"
  //       }
  //     });
  //
  //     response.on('end', function() {
  //       var data = response._getData();
  //
  //       expect(response.statusCode).to.equal(403);
  //       expect(data.minor_code).to.equal(1006);
  //
  //       done();
  //     });
  //
  //     this.controller.RefreshSession(request, response, next);
  //   });
  //
  // });
});
