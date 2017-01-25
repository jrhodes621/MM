const expect = require('chai').expect;
const async = require('async');
const factory = require('factory-girl');
const request = require('supertest');
const app = require('../server');
const BeforeHooks = require('../test/hooks/before.hooks.js');
const AfterHooks = require('../test/hooks/after.hooks.js');

const User = require('../models/user');

describe('Users API Endpoint', () => {
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
  describe('Create User', () => {
    it('should return 201 when succeeds', (done) => {
      request(app)
      .post('/api/users')
      .send({
        company_name: 'ABC Company',
        email_address: 'test@demo.com',
        password: 'test123',
        first_name: 'Test',
        last_name: 'User',
        role: 'Bull',
      })
      .expect(201)
      .then((res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.success).to.equal(true);
        expect(res.body).to.have.property('token');
        expect(res.body).to.have.property('user_id');

        done();
      });
    });
    it('should return a jwt token and user id', (done) => {
      request(app)
      .post('/api/users')
      .send({
        company_name: 'ABC Company',
        email_address: 'test@demo.com',
        password: 'test123',
        first_name: 'Test',
        last_name: 'User',
        role: 'Bull',
      })
      .expect(201)
      .then((res) => {
        expect(res.body).to.equal('object');
        expect(res.body).to.have.property('token');
        expect(res.body).to.have.property('user_id');

        done();
      });
    });
    it('should create new user', (done) => {
      request(app)
      .post('/api/users')
      .send({
        company_name: 'ABC Company',
        email_address: 'test@demo.com',
        password: 'test123',
        first_name: 'Test',
        last_name: 'User',
        role: 'Bull',
      })
      .expect(201)
      .then((res) => {
        const userId = res.body.user_id;

        User.findById(userId, (err, user) => {
          expect(user.email_address).to.equal('test@demo.com');

          done(err);
        });
      });
    });
    it('should create new account', (done) => {
      request(app)
      .post('/api/users')
      .send({
        company_name: 'ABC Company',
        email_address: 'test@demo.com',
        password: 'test123',
        first_name: 'Test',
        last_name: 'User',
        role: 'Bull',
      })
      .expect(201)
      .then((res) => {
        const userId = res.body.user_id;

        User.findById(userId)
        .populate('account')
        .exec((err, user) => {
          expect(user).to.have.property('account');
          expect(user.account.company_name).to.equal('ABC Company');

          done(err);
        });
      });
    });
    it('should create a Stripe customer if bull is connected to stripe', (done) => {
      done(new Error('Not Implemented'));
    });
    it('should return a 404 if the email address is already used', (done) => {
      const user = factory.buildSync('user');

      user.save((err) => {
        request(app)
        .post('/api/users')
        .send({
          company_name: 'ABC Company',
          email_address: user.email_address,
          password: 'test123',
          first_name: 'Test',
          last_name: 'User',
          role: 'Bull',
        })
        .expect(201)
        .then((res) => {
          expect(res.body).to.be.an('object');
          expect(res.body.sucucess).to.equal(false);

          done(err);
        });
      });
    });
    it('should subscribe the user to the Membermoose free plan', (done) => {
      done(new Error('Not Implemented'));
    });
  });
  describe('Update User', () => {
    it('should return a 200 when successful', (done) => {
      done(new Error('Not Implemented'));
    });
  });
});
