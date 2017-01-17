var expect        = require('chai').expect;
var async         = require("async");
var factory       = require('factory-girl');
var request       = require('supertest');
var app           = require('../server');
var security      = require('../security');

var UserFactory   = require("../test/factories/user.factory.js");
var BeforeHooks   = require("../test/hooks/before.hooks.js");
var AfterHooks    = require("../test/hooks/after.hooks.js");

var User = require('../models/user');

describe("Users API Endpoint", function() {
  var user = null;

  beforeEach(function(done) {
    async.waterfall([
      function openConnection(callback) {
        BeforeHooks.SetupDatabase(callback)
      }
    ], function(err) {
      done(err);
    });
  });
  afterEach(function(done){
    AfterHooks.CleanUpDatabase(function(err) {
      done(err);
    });
  });
  describe("Create User", function() {
    it('should return 201 when succeeds', function(done) {
      request(app)
      .post('/api/users')
      .send({
        "company_name": "ABC Company",
        "email_address": "test@demo.com",
        "password": "test123",
        "first_name": "Test",
        "last_name": "User",
        "role": "Bull"
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
    it('should return a jwt token and user id', function(done) {
      request(app)
      .post('/api/users')
      .send({
        "company_name": "ABC Company",
        "email_address": "test@demo.com",
        "password": "test123",
        "first_name": "Test",
        "last_name": "User",
        "role": "Bull"
      })
      .expect(201)
      .then((res) => {
        expect(res.body).to.equal('object');
        expect(res.body).to.have.property('token');
        expect(res.body).to.have.property('user_id');

        done();
      });
    });
    it('should create new user', function(done) {
      request(app)
      .post('/api/users')
      .send({
        "company_name": "ABC Company",
        "email_address": "test@demo.com",
        "password": "test123",
        "first_name": "Test",
        "last_name": "User",
        "role": "Bull"
      })
      .expect(201)
      .then((res) => {
        var user_id = res.body.user_id;

        User.findById(user_id, function(err, user) {
          expect(user.email_address).to.equal("test@demo.com");

          done(err);
        });
      });
    });
    it('should create new account', function(done) {
      request(app)
      .post('/api/users')
      .send({
        "company_name": "ABC Company",
        "email_address": "test@demo.com",
        "password": "test123",
        "first_name": "Test",
        "last_name": "User",
        "role": "Bull"
      })
      .expect(201)
      .then((res) => {
        var user_id = res.body.user_id;

        User.findById(user_id)
        .populate('account')
        .exec(function(err, user) {
          console.log(user);

          expect(user).to.have.property('account');
          expect(user.account.company_name).to.equal("ABC Company");

          done(err);
        });
      });
    });
    it('should create a Stripe customer if bull is connected to stripe', function(done) {
      done(new Error("Not Implemented"));
    });
    it('should return a 404 if the email address is already used' , function(done) {
      let user = factory.buildSync('user');

      user.save(function(err) {
        request(app)
        .post('/api/users')
        .send({
          "company_name": "ABC Company",
          "email_address": user.email_address,
          "password": "test123",
          "first_name": "Test",
          "last_name": "User",
          "role": "Bull"
        })
        .expect(201)
        .then((res) => {
          expect(res.body).to.be.an('object');
          expect(res.body.sucucess).to.equal(false);
        });
      });
    });
    it('should subscribe the user to the Membermoose free plan' , function(done) {
      done(new Error("Not Implemented"));
    });
  });
  describe("Update User", function() {
    it('should return a 200 when successful', function(done) {
      done(new Error("Not Implemented"));
    });
  });
})
