var chai = require('chai');
var expect = chai.expect;

var http_mocks = require('node-mocks-http');
var mockery = require('mockery');
var mongoose = require('mongoose');

var AccountFixtures = require('../fixtures/account.fixtures')
var AccountServicesMock = require('../models/account.services.mock');

var Account = require('../models/account');
var User = require('../models/user');

function buildResponse() {
  return http_mocks.createResponse({eventEmitter: require('events').EventEmitter})
}
function next(err) {
  console.log(err);
}

var user = {
  "status": "Active",
  "email_address": "james@membermoose.com",
  "password": "mm1234",
}
var account = {
  company_name: "Membermoose",
  subdomain: "membermoose",
  status: "active"
}

var current_user = new User(user)
current_user.account = new Account(account);

describe("Plans API Endpoint", function() {
  beforeEach(function(done) {
    mockery.enable({
      warnOnReplace: true,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    mockery.registerMock('../models/account.services', AccountServicesMock);

    this.controller = require('../controllers/accounts.controller');

    done();
  });
  afterEach(function(done) {
    mockery.disable();

    done();
  });
  describe("Update Account", function() {
    it('returns an Account', function(done) {
      var response = buildResponse()
      var request  = http_mocks.createRequest({
        method: 'PUT',
        url: '/account/',
        current_user: current_user,
        plan: AccountFixtures.account,
        params: {
          account_id: AccountFixtures.account._id
        },
        body: {
          company_name: "MemberMoose Updated",
          subdomain: "membermoose.updated"
        }
      });

      response.on('end', function() {
        var account = JSON.parse(response._getData());
        expect(account.company_name).to.equal(AccountFixtures.updated_account.company_name);
        expect(account.subdomain).to.equal(AccountFixtures.updated_account.subdomain);

        done();
      });

      this.controller.UpdateAccount(request, response, next);
    });
  });
});
