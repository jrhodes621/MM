const expect = require('chai').expect;
const async = require('async');
const factory = require('factory-girl');
const request = require('supertest');
const app = require('../server');
const security = require('../security');
const faker = require('faker');
const UserFactory = require('../test/factories/user.factory.js');
const BeforeHooks = require('../test/hooks/before.hooks.js');
const AfterHooks = require('../test/hooks/after.hooks.js');

describe('On Boarding API Endpoint', () => {
  beforeEach((done) => {
    done();
  });
  afterEach((done) => {
    done();
  });
  describe('Connect Stripe', () => {
    it('should return a 200 when successful', (done) => {
      done(new Error('Not Implemented'));
    });
    it('should return the sign in user', (done) => {
      done(new Error('Not Implemented'));
    });
    it('should save the Stripe connect information to the user', (done) => {
      done(new Error('Not Implemented'));
    });
    it('should save the account_id returned by Stripe in the reference_id of the user', (done) => {
      done(new Error('Not Implemented'));
    });
    it('should return an error if the json web token is invalid', (done) => {
      done(new Error('Not Implemented'));
    });
  });
});
