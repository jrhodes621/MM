const expect = require('chai').expect;
const async = require('async');
const factory = require('factory-girl');
const request = require('supertest');
const app = require('../server');
const security = require('../security');
const BeforeHooks = require('../test/hooks/before.hooks.js');
const AfterHooks = require('../test/hooks/after.hooks.js');

describe('Activities API Endpoint', () => {
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
          user.account = bull
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
  describe('let Activities', () => {
    it('should return a 200 when succeeds', (done) => {
      const user = factory.buildSync('user');

      user.save((err) => {
        if (err) { done(err); }

        factory.createMany('activity', {}, 35,
          { bull,
            calf: user,
            type: 'test activity',
            message_calf: 'Message Calf',
            message_bull: 'Message Bull',
          }, (err, activities) => {
            request(app)
            .get('/api/activities')
            .set('x-access-token', jsonWebToken)
            .expect(200)
            .then((res) => {
              expect(res.body).to.be.an('array');
              expect(res.body[0].activities).to.be.an('array');

              done();
            });
          });
      });
    });
    it('should return array of activities grouped by date', (done) => {
      done(new Error('Not Implemented'));
    });
    it('should only return activities for the current bull', (done) => {
      done(new Error('Not Implemented'));
    });
    it('should return activities sorted by create date asc', (done) => {
      done(new Error('Not Implemented'));
    });
  });
});
