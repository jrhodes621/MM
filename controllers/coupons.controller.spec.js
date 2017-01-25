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

describe('Coupon API Endpoint', () => {
  beforeEach((done) => {
    done();
  });
  afterEach((done) => {
    done();
  });
  describe('Get Coupons', () => {

  });
  describe('Get a Coupon', () => {

  });
  describe('Create a Coupon', () => {

  });
  describe('Update a Coupon', () => {

  });
});
