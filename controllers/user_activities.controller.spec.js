const expect = require('chai').expect;
const async = require('async');
const factory = require('factory-girl');
const request = require('supertest');
const app = require('../server');
const security = require('../security');
const BeforeHooks = require('../test/hooks/before.hooks.js');
const AfterHooks = require('../test/hooks/after.hooks.js');

describe('User Activities API Endpoint', () => {
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
      function createOther(callback) {
        factory.create('account', (err, account) => {
          otherBull = account;

          callback();
        });
      },
      function createUser(callback) {
        factory.create('bull', (err, user) => {
          if (err) { callback(err); }

          user.account = bull
          user.save((err) => {
            if (err) { callback(err); }

            bullUser = user;

            security.generate_token(bullUser, process.env.SECRET, (err, token) => {
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
  describe('Get Activities', () => {
    it('should return a 200 when succeeds', (done) => {
      const user = factory.buildSync('user');

      user.save((err) => {
        if (err) { done(err); }

        factory.createMany('activity', {}, 35,
          { bull,
            user,
            type: 'test activity',
            message_calf: 'Message Calf',
            message_bull: 'Message Bull',
          }, (err) => {
            request(app)
            .get('/api/users/' + user._id + '/activities')
            .set('x-access-token', jsonWebToken)
            .expect(200)
            .then((res) => {
              expect(res.body).to.be.an('array');
              expect(res.body[0].activities).to.be.an('array');
              expect(res.body[0].activities).to.have.length(35);

              done(err);
            });
          });
      });
    });
    it('should return 404 if calf is not member of bull', (done) => {
      done(new Error('Not Implemented'));
    });
    it('should return array of activities grouped by date', (done) => {
      done(new Error('Not Implemented'));
    });
    it('should only return activities for the current bull', (done) => {
      done(new Error('Not Implemented'));
    });
  });
});
