const expect = require('chai').expect;
const async = require('async');
const request = require('supertest');
const app = require('../server');
const BeforeHooks = require('../test/hooks/before.hooks.js');
const AfterHooks = require('../test/hooks/after.hooks.js');

describe('User Payment Cards API Endpoint', () => {
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
  describe('Create Payment Card', () => {
    it('should return a 201 when succeeds', (done) => {
      request(app)
      .post('/api/user_payment_cards')
      .send({
        stripe_token: '',
      })
      .expect(201)
      .then((res) => {
        expect(res.body).to.be.an('object');

        done();
      });
    });
    it('should return a 404 if user is not member of bull', (done) => {
      done(new Error('Not Implemented'));
    });
    it('should create new payment card', (done) => {
      done(new Error('Not Implemented'));
    });
    it('should create card in Stripe', (done) => {
      done(new Error('Not Implemented'));
    });
    it('should return 403 if bull is not connected to Stripe', (done) => {
      done(new Error('Not Implemented'));
    });
  });
});
