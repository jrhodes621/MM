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

describe('OAuth API Endpoint', () => {
  beforeEach((done) => {
    done();
  });
  afterEach((done) => {
    done();
  });
  describe('Stripe OAuth Callback', () => {
    it('should return 200 when valid code and state is password in Stripe callback', (done) => {
      done(new Error('Not Implemented'));
    });
    it('should return an error is a User is not found', (done) => {
      done(new Error('Not Implemented'));
    });
    it('should save a Stripe Connect json object to the user', (done) => {
      done(new Error('Not Implemented'));
    });
    it('should redirect user to the dashboard plan page', (done) => {
      done(new Error('Not Implemented'));
    });
    it('should return an error if the query does not contain a code and state', (done) => {
      done(new Error('Not Implemented'));
    });
  });
});
