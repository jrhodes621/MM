const expect = require('chai').expect;
const async = require('async');
const factory = require('factory-girl');
const request = require('supertest');
const app = require('../server');
const security = require('../security');
const User = require('../models/user');
const BeforeHooks = require('../test/hooks/before.hooks.js');
const AfterHooks = require('../test/hooks/after.hooks.js');

describe('User Devices API Endpoint', () => {
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
  describe('Add a Device', () => {
    it('should return a 201 when succeeds', (done) => {
      const user = factory.buildSync('user');

      user.save((err) => {
        if (err) { done(err); }

        security.generate_token(user, process.env.SECRET, (err, token) => {
          if (err) { done(err); }

          request(app)
          .post('/api/users/' + user._id + '/devices')
          .set('x-access-token', token)
          .send({
            device_type: 'iPhone',
            device_identifier: 'DEVICEABC',
            device_token: 'TOKENABC',
          })
          .expect(201)
          .then((res) => {
            expect(res.body).to.be.an('object');

            done();
          });
        });
      });
    });
    it('should register a new device if not a device with same device identifier', (done) => {
      const user = factory.buildSync('user');

      user.save((err) => {
        if (err) { done(err); }

        security.generate_token(user, process.env.SECRET, (err, token) => {
          if(err) { done(err); }

          request(app)
          .post('/api/users/' + user._id + '/devices')
          .set('x-access-token', token)
          .send({
            device_type: 'iPhone',
            device_identifier: 'DEVICEABC',
            device_token: 'TOKENABC',
          })
          .expect(201)
          .then((res) => {
            User.findById(user._id, (err, user) => {
              expect(user.devices.length).to.equal(1);

              done(err);
            });
          });
        });
      });
    });
    it('should return a 200 if device already was added', (done) => {
      const user = factory.buildSync('user');
      const device = {
        device_type: 'iPhone',
        device_identifier: 'DEVICEABC',
        device_token: 'TOKENABC',
      };
      user.devices.push(device);

      user.save((err) => {
        if (err) { done(err); }

        security.generate_token(user, process.env.SECRET, (err, token) => {
          if (err) { done(err); }
          request(app)
          .post('/api/users/' + user._id + '/devices')
          .set('x-access-token', token)
          .send({
            device_type: 'iPhone',
            device_identifier: 'DEVICEABC',
            device_token: 'TOKENABC',
          })
          .expect(200)
          .then((res) => {
            expect(res.body).to.be.an('object');

            done();
          });
        });
      });
    });
    it('should not register a new device if exists device with same device identifier', (done) => {
      const user = factory.buildSync('user');
      const device = {
        device_type: 'iPhone',
        device_identifier: 'DEVICEABC',
        device_token: 'TOKENABC',
      };
      user.devices.push(device);

      user.save((err) => {
        if (err) { done(err); }

        security.generate_token(user, process.env.SECRET, (err, token) => {
          if (err) { done(err); }

          request(app)
          .post('/api/users/' + user._id + '/devices')
          .set('x-access-token', token)
          .send({
            device_type: 'iPhone',
            device_identifier: 'DEVICEABC',
            device_token: 'TOKENABC',
          })
          .expect(200)
          .then((res) => {
            User.findById(user._id, (err, user) => {
              expect(user.devices.length).to.equal(1);

              done(err);
            });
          });
        });
      });
    });
    it('should return 403 if token is invalid', (done) => {
      const user = factory.buildSync('user');
      const device = {
        device_type: 'iPhone',
        device_identifier: 'DEVICEABC',
        device_token: 'TOKENABC',
      };
      user.devices.push(device);

      user.save((err) => {
        if (err) { done(err); }

        security.generate_token(user, process.env.SECRET, (err, token) => {
          if (err) { done(err); }

          request(app)
          .post('/api/users/' + user._id + '/devices')
          .send({
            device_type: 'iPhone',
            device_identifier: 'DEVICEABC',
            device_token: 'TOKENABC',
          })
          .expect(403)
          .then((res) => {
            expect(res.body).to.be.an('object');

            done();
          });
        });
      });
    });
    it('should return a device json object', (done) => {
      const user = factory.buildSync('user');

      user.save((err) => {
        if (err) { done(err); }

        security.generate_token(user, process.env.SECRET, (err, token) => {
          if (err) { done(err); }

          request(app)
          .post('/api/users/' + user._id + '/devices')
          .set('x-access-token', token)
          .send({
            device_type: 'iPhone',
            device_identifier: 'DEVICEABC',
            device_token: 'TOKENABC',
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
