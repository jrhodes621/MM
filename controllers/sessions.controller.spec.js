const expect = require('chai').expect;
const async = require('async');
const factory = require('factory-girl');
const request = require('supertest');
const app = require('../server');
const BeforeHooks = require('../test/hooks/before.hooks.js');
const AfterHooks = require('../test/hooks/after.hooks.js');

describe('Sessions API Endpoint', () => {
  beforeEach((done) => {
    async.waterfall([
      function openConnection(callback) {
        BeforeHooks.SetupDatabase(callback);
      },
    ], (err) => {
      done(err);
    });
  });
  afterEach((done) => {
    AfterHooks.CleanUpDatabase((err) => {
      done(err);
    });
  });
  describe('Create Session', () => {
    it('should return 200 when credentials are valid', (done) => {
      const user = factory.buildSync('user');

      user.save((err) => {
        if (err) { done(err); }

        request(app)
        .post('/api/sessions')
        .send({
          email_address: user.email_address,
          password: 'test123',
        })
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an('object');

          done(err);
        });
      });
    });
  });
  //   it('should return token and refesh_token when credentials are valid', (done) => {
  //     const response = buildResponse()
  //     const request  = http_mocks.createRequest({
  //       method: 'POST',
  //       url: '/sessions',
  //       body: {
  //         email_address: "james@somehero.com",
  //         password: "test123"
  //       }
  //     });
  //
  //     response.on('end', () => {
  //       const data = JSON.parse(response._getData());
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
  //   it('should persist the refresh_token', (done) => {
  //     const response = buildResponse()
  //     const request  = http_mocks.createRequest({
  //       method: 'POST',
  //       url: '/sessions',
  //       body: {
  //         email_address: "james@somehero.com",
  //         password: "test123"
  //       }
  //     });
  //
  //     response.on('end', () => {
  //       const data = JSON.parse(response._getData());
  //
  //       User.GetUserById(user.id, function(err, user) {
  //         expect(user.refresh_token).to.equal(data.refresh_token);
  //         done();
  //       });
  //     });
  //
  //     this.controller.CreateSession(request, response, next);
  //   });
  //   it('should return 403 and 1004 minor code when both email_address and password are invalid',
  // (done) => {
  //     const response = buildResponse()
  //     const request  = http_mocks.createRequest({
  //       method: 'POST',
  //       url: '/sessions',
  //       body: {
  //         email_address: "james@email.com",
  //         password: "badpassword"
  //       }
  //     });
  //
  //     response.on('end', () => {
  //       const data = response._getData();
  //
  //       expect(response.statusCode).to.equal(403);
  //       expect(data.minor_code).to.equal(1004);
  //
  //       done();
  //     });
  //
  //     this.controller.CreateSession(request, response, next);
  //   });
  //   it('should return 403 and 1005 minor code when email_address is valid and password is invalid',
  // (done) => {
  //     const response = buildResponse()
  //     const request  = http_mocks.createRequest({
  //       method: 'POST',
  //       url: '/sessions',
  //       body: {
  //         email_address: "james@somehero.com",
  //         password: "badpassword"
  //       }
  //     });
  //
  //     response.on('end', () => {
  //       const data = response._getData();
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
  // describe("Refresh Session", () => {
  //   it('should return 200 if refresh token is valid', (done) => {
  //
  //   });
  //   it('should return token and new refesh_token when refresh token is valid', (done) => {
  //
  //   });
  //   it('should persist refresh token in db', (done) => {
  //
  //   });
  //   it('should return 403 with minor code 1006 if refresh token is not valid', (done) => {
  //     const response = buildResponse()
  //     const request  = http_mocks.createRequest({
  //       method: 'POST',
  //       url: '/sessions/verify',
  //       body: {
  //         refresh_token: "1234"
  //       }
  //     });
  //
  //     response.on('end', () => {
  //       const data = response._getData();
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
