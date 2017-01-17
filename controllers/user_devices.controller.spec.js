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

describe("User Devices API Endpoint", function() {
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
  describe("Add a Device", function() {
    it('should return a 201 when succeeds', function(done) {
      let user = factory.buildSync('user');

      user.save(function(err) {
        if(err) { done(err); }

        security.generate_token(user, process.env.SECRET, function(err, token) {
          if(err) { done(err); }
          request(app)
          .post('/api/users/' + user._id + '/devices')
          .set('x-access-token', token)
          .send({
            "device_type": "iPhone",
            "device_identifier": "DEVICEABC",
            "device_token": "TOKENABC"
          })
          .expect(201)
          .then((res) => {
            expect(res.body).to.be.an('object');

            done();
          });
        });
      });
    });
    it('should register a new device if not a device with same device identifier', function(done) {
      let user = factory.buildSync('user');

      user.save(function(err) {
        if(err) { done(err); }

        security.generate_token(user, process.env.SECRET, function(err, token) {
          if(err) { done(err); }
          request(app)
          .post('/api/users/' + user._id + '/devices')
          .set('x-access-token', token)
          .send({
            "device_type": "iPhone",
            "device_identifier": "DEVICEABC",
            "device_token": "TOKENABC"
          })
          .expect(201)
          .then((res) => {
            User.findById(user._id, function(err, user) {
              expect(user.devices.length).to.equal(1);

              done(err);
            });
          });
        });
      });
    });
    it('should return a 200 if device already was added', function(done) {
      let user = factory.buildSync('user');
      var device = {
        "device_type": "iPhone",
        "device_identifier": "DEVICEABC",
        "token": "TOKENABC"
      };
      user.devices.push(device);

      user.save(function(err) {
        if(err) { console.log(err);

          done(err); }

        security.generate_token(user, process.env.SECRET, function(err, token) {
          if(err) { done(err); }
          request(app)
          .post('/api/users/' + user._id + '/devices')
          .set('x-access-token', token)
          .send({
            "device_type": "iPhone",
            "device_identifier": "DEVICEABC",
            "device_token": "TOKENABC"
          })
          .expect(200)
          .then((res) => {
            expect(res.body).to.be.an('object');

            done();
          });
        });
      });
    });
    it('should not register a new device if exists device with same device identifier', function(done) {
      let user = factory.buildSync('user');
      var device = {
        "device_type": "iPhone",
        "device_identifier": "DEVICEABC",
        "token": "TOKENABC"
      };
      user.devices.push(device);

      user.save(function(err) {
        if(err) { console.log(err);

          done(err); }

        security.generate_token(user, process.env.SECRET, function(err, token) {
          if(err) { done(err); }
          request(app)
          .post('/api/users/' + user._id + '/devices')
          .set('x-access-token', token)
          .send({
            "device_type": "iPhone",
            "device_identifier": "DEVICEABC",
            "device_token": "TOKENABC"
          })
          .expect(200)
          .then((res) => {
            User.findById(user._id, function(err, user) {
              expect(user.devices.length).to.equal(1);

              done(err);
            });
          });
        });
      });
    });
    it('should return 403 if token is invalid', function(done) {
      let user = factory.buildSync('user');
      var device = {
        "device_type": "iPhone",
        "device_identifier": "DEVICEABC",
        "token": "TOKENABC"
      };
      user.devices.push(device);

      user.save(function(err) {
        if(err) { console.log(err);

          done(err); }

        security.generate_token(user, process.env.SECRET, function(err, token) {
          if(err) { done(err); }
          request(app)
          .post('/api/users/' + user._id + '/devices')
          .send({
            "device_type": "iPhone",
            "device_identifier": "DEVICEABC",
            "device_token": "TOKENABC"
          })
          .expect(403)
          .then((res) => {
            expect(res.body).to.be.an('object');

            done();
          });
        });
      });
    });
    it('should return a device json object', function(done) {
      let user = factory.buildSync('user');

      user.save(function(err) {
        if(err) { done(err); }

        security.generate_token(user, process.env.SECRET, function(err, token) {
          if(err) { done(err); }
          request(app)
          .post('/api/users/' + user._id + '/devices')
          .set('x-access-token', token)
          .send({
            "device_type": "iPhone",
            "device_identifier": "DEVICEABC",
            "device_token": "TOKENABC"
          })
          .expect(201)
          .then((res) => {
            expect(res.body.device_type).to.equal('iPhone');
            expect(res.body.device_identifier).to.equal('DEVICEABC');
            expect(res.body.token).to.equal('TOKENABC');

            done();
          });
        });
      });
    });
  });
});
