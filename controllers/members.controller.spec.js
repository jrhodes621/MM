const expect = require('chai').expect;
const async = require('async');
const factory = require('factory-girl');
const request = require('supertest');
const app = require('../server');
const security = require('../security');
const BeforeHooks = require('../test/hooks/before.hooks.js');
const AfterHooks = require('../test/hooks/after.hooks.js');

describe('Members API Endpoint', () => {
  let bull = null;
  let bullUser = null;
  let jsonWebToken = null;

  beforeEach((done) => {
    async.waterfall([
      function openConnection(callback) {
        BeforeHooks.SetupDatabase(callback);
      },
      function createBull(callback) {
        factory.create('account', (err, account) => {
          bull = account;

          callback();
        });
      },
      function createUser(callback) {
        factory.create('bull', (err, user) => {
          user.account = bull;
          user.save((err) => {
            bullUser = user;

            security.generate_token(bullUser, process.env.SECRET, (err, token) => {
              if (err) { callback(err); }

              jsonWebToken = token;

              callback(err);
            });
          });
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
  describe('Get Members', () => {
    it('should return a 200 when successfull', (done) => {
      factory.createMany('membership', {}, 3, { bull }, (err, memberships) => {
        request(app)
        .get('/api/members')
        .set('x-access-token', jsonWebToken)
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an('object');

          done();
        });
      });
    });
    it('should return an array of members', (done) => {
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
      .set('x-access-token', jsonWebToken)
      .expect(200)
      .then((res) => {
        expect(res.body).to.be.an('array');

        done();
      });
    });
  });
});
