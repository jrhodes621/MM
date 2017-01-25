const expect = require('chai').expect;
const async = require('async');
const factory = require('factory-girl');
const request = require('supertest');
const app = require('../server');
const BeforeHooks = require('../test/hooks/before.hooks.js');
const AfterHooks = require('../test/hooks/after.hooks.js');

describe('Subscribe API Endpoint', () => {
  let bull = null;

  beforeEach((done) => {
    async.waterfall([
      function openConnection(callback) {
        BeforeHooks.SetupDatabase(callback);
      },
      function createAccount(callback) {
        factory.create('account', (err, account) => {
          bull = account;

          callback();
        });
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
  describe('Create Subscription', () => {
    it('should create a new subscription', (done) => {
      factory.create('plan', {}, { account: bull }, (err, plan) => {
        if (err) { done(err); }

        const params = {
          plan_id: plan.id,
          email_address: 'test1@demo.com',
          password: 'test123',
          first_name: 'James',
          last_name: 'Rhodes',
        };
        request(app)
        .post('/api/accounts/' + bull.subdomain + '/subscribe')
        .send(params)
        .expect(201)
        .then((res) => {
          expect(res.body).to.be.an('object');

          done();
        });
      });
    });
  });
});
