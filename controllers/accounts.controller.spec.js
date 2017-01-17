var expect        = require('chai').expect;
var async         = require("async");
var factory       = require('factory-girl');
var request       = require('supertest');
var app           = require('../server');
var security      = require('../security');
var faker         = require('faker');

var UserFactory   = require("../test/factories/user.factory.js");
var BeforeHooks   = require("../test/hooks/before.hooks.js");
var AfterHooks    = require("../test/hooks/after.hooks.js");

describe("Accounts API Endpoint", function() {
  var bull = null;
  var bull_user = null;
  var json_web_token = null;

  beforeEach(function(done) {
    async.waterfall([
      function openConnection(callback) {
        BeforeHooks.SetupDatabase(callback)
      },
      function createAccount(callback) {
        factory.create('account', function(err, account) {
          bull = account;

          callback();
        });
      },
      function createUser(callback) {
        factory.create('bull', function(err, user) {
          user.account = bull
          user.save(function(err) {
            if(err) { console.log(err); }

            bull_user = user;

            security.generate_token(bull_user, process.env.SECRET, function(err, token) {
              if(err) { console.log(err); }

              json_web_token = token;

              callback(err)
            });
          });
        });
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
  describe("Update Account", function() {
    it('should return 200 when succeeds', function(done) {
      var update_params = {
        "company_name": faker.company.companyName(),
        "subdomain": faker.internet.domainWord()
      };
      request(app)
      .put('/api/accounts')
      .set('x-access-token', json_web_token)
      .send(update_params)
      .expect(200)
      .then((res) => {
        expect(res.body).to.be.an('object');

        done();
      });
    });
    it('returns an account', function(done) {
      var update_params = {
        "company_name": faker.company.companyName(),
        "subdomain": faker.internet.domainWord()
      };
      request(app)
      .put('/api/accounts')
      .set('x-access-token', json_web_token)
      .send(update_params)
      .expect(200)
      .then((res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.reference_id).to.equal(bull.reference_id);
        expect(res.body.company_name).to.equal(update_params.company_name);
        expect(res.body.subdomain).to.equal(update_params.subdomain);
        expect(res.body.subscription).to.equal(bull.subscription);
        expect(res.body.plans).to.have.length(bull.plans.length);
        expect(res.body.members).to.have.length(bull.members.length);
        expect(res.body.status).to.equal(bull.status);

        done();
      });
    });
  });
});
