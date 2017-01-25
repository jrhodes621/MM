const expect = require('chai').expect;
const async = require('async');
const factory = require('factory-girl');
const request = require('supertest');
const app = require('../server');
const security = require('../security');
const BeforeHooks = require('../test/hooks/before.hooks.js');
const AfterHooks = require('../test/hooks/after.hooks.js');

describe('Me API Endpoint', () => {
  let user = null;

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
  describe('Get User', () => {
    it('should return a 200 when session is valid', (done) => {
      let user = factory.buildSync('user');

      user.save((err) => {
        if (err) { done(err); }

        security.generate_token(user, process.env.SECRET, (err, token) => {
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
    });
    it('should return a 403 when session is invalid', (done) => {
      let user = factory.buildSync('user');

      user.save((err) => {
        if (err) { done(err); }

        security.generate_token(user, process.env.SECRET, (err, token) => {
          if (err) { done(err); }

          const badToken = 'abc';

          request(app)
          .get('/api/me')
          .set('x-access-token', badToken)
          .expect(403)
          .then((res) => {
            expect(res.body).to.be.an('object');

            done(err);
          });
        });
      });
    });
    it('should return a User when session is valid', (done) => {
      let user = factory.buildSync('user');

      user.save((err) => {
        if (err) { done(err); }

        security.generate_token(user, process.env.SECRET, (err, token) => {
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
    });
  });
});
