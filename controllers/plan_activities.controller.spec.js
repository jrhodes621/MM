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

describe('Plan Activities API Endpoint', () => {
  beforeEach((done) => {
    done();
  });
  afterEach((done) => {
    done();
  });
  describe('Get Activities', () => {
    it('should return 200 when successful', (done) => {
      done(new Error('Not Implemented'));
    });
    it('should return activities grouped by dates desc', (done) => {
      done(new Error('Not Implemented'));
    });
    it('should return activities in each grouped sorted by time desc', (done) => {
      done(new Error('Not Implemented'));
    });
    it('should only return activities for the specified plan', (done) => {
      done(new Error('Not Implemented'));
    });
    it('should return an 403 error if the current user does not own the specified plan', (done) => {
      done(new Error('Not Implemented'));
    });
    it('should return an error if the token is not valid', (done) => {
      done(new Error('Not Implemented'));
    });
  });
});
