const expect = require('chai').expect;
const async = require('async');
const factory = require('factory-girl');
const request = require('supertest');
const app = require('../server');
const security = require('../security');
const faker = require('faker');
const BeforeHooks = require('../test/hooks/before.hooks.js');
const AfterHooks = require('../test/hooks/after.hooks.js');

describe('Accounts API Endpoint', () => {
  let bull = null;
  let bullUser = null;
  let jsonWebToken = null;

  beforeEach((done) => {
    async.waterfall([
      function openConnection(callback) {
        BeforeHooks.SetupDatabase(callback)
      },
      function createAccount(callback) {
        factory.create('account', (err, account) => {
          bull = account;

          callback();
        });
      },
      function createUser(callback) {
        factory.create('bull', (err, user) => {
          user.account = bull;
          user.save((err) => {
            if (err) { callback(err); }

            bullUser = user;

            security.generate_token(bullUser, process.env.SECRET, (err, token) => {
              if (err) { callback(err); }

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
  describe('Update Account', () => {
    it('should return 200 when succeeds', (done) => {
      const updateParams = {
        company_name: faker.company.companyName(),
        subdomain: faker.internet.domainWord(),
      };
      request(app)
      .put('/api/accounts')
      .set('x-access-token', jsonWebToken)
      .send(updateParams)
      .expect(200)
      .then((res) => {
        expect(res.body).to.be.an('object');

        done();
      });
    });
    it('returns an account', (done) => {
      const updateParams = {
        company_name: faker.company.companyName(),
        subdomain: faker.internet.domainWord(),
      };
      request(app)
      .put('/api/accounts')
      .set('x-access-token', jsonWebToken)
      .send(updateParams)
      .expect(200)
      .then((res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.reference_id).to.equal(bull.reference_id);
        expect(res.body.company_name).to.equal(updateParams.company_name);
        expect(res.body.subdomain).to.equal(updateParams.subdomain);
        expect(res.body.subscription).to.equal(bull.subscription);
        expect(res.body.plans).to.have.length(bull.plans.length);
        expect(res.body.members).to.have.length(bull.members.length);
        expect(res.body.status).to.equal(bull.status);

        done();
      });
    });
  });
});
