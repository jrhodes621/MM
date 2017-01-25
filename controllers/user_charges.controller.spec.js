const expect = require('chai').expect;
const async = require('async');
const factory = require('factory-girl');
const request = require('supertest');
const app = require('../server');
const security = require('../security');
const BeforeHooks = require('../test/hooks/before.hooks');
const AfterHooks = require('../test/hooks/after.hooks.js');

describe('User Charges API Endpoint', () => {
  let bull = null;
  let bullUser = null;
  let jsonWebToken = null;
  let calf = null;

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
      function createBullUser(callback) {
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
      function createUser(callback) {
        factory.create('user', (err, user) => {
          calf = user;

          callback(err);
        });
      },
      function createMembership(callback) {
        factory.create('membership', {}, {
          calf,
          bull,
        }, (err, membership) => {
          calf.memberships.push(membership);

          calf.save((err) => {
            callback(err);
          });
        });
      },
      function createPaymentCard(callback) {
        factory.create('payment_card', (err, paymentCard) => {
          calf.payment_cards.push(paymentCard);

          calf.save((err) => {
            callback(err);
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
  describe('Get Charges', () => {
    it('should return a 200 when succeeds', (done) => {
      factory.createMany('charge', {}, 35,
        { membership: calf.memberships[0],
          payment_card: calf.payment_cards[0],
        }, (err) => {
          request(app)
          .get('/api/users/' + calf._id + '/charges')
          .set('x-access-token', jsonWebToken)
          .expect(200)
          .then((res) => {
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.length(35);

            done();
          });
        });
    });
    it('should return array of charges', (done) => {
      done(new Error('Not Implemented'));
    });
    it('should only return charges for the current bull', (done) => {
      done(new Error('Not Implemented'));
    });
    it('should return a 200 when succeeds', (done) => {
      done(new Error('Not Implemented'));
    });
    it('should return 404 if calf is not member of bull', (done) => {
      done(new Error('Not Implemented'));
    });
  });
  describe('Create a One Time Charge', () => {
    it('should return a 201 when succeeds', (done) => {
      const user = factory.createSync('user');
      security.generate_token(user, process.env.SECRET, (err, token) => {
        if (err) { done(err); }

        request(app)
        .post('/api/users/' + user._id + '/charges')
        .set('x-access-token', token)
        .send({
          amount: '100.00',
          currency: 'usd',
          description: 'test charge',
        })
        .expect(201)
        .then((res) => {
          expect(res.body).to.be.an('object');

          done();
        });
      });
    });
    it('should return a 403 if bull is not connected to Stripe', (done) => {
      done(new Error('Not Implemented'));
    });
    it('should return a Stripe reference_id if connected to Stripe', (done) => {
      done(new Error('Not Implemented'));
    });
    it('should call Stripe to create a charge', (done) => {
      done(new Error('Not Implemented'));
    });
    it('should return a charge json object', (done) => {
      done(new Error('Not Implemented'));
    });
    it('should add a charge to the current user', (done) => {
      done(new Error('Not Implemented'));
    });
  });
});
