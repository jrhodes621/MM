var expect    = require('chai').expect;
var Account   = require('../models/account');

describe('Account', function(done) {
  it('should be invalid if company_name is empty', function(done) {
      var account = new Account();

      account.validate(function(err) {
        expect(err.errors.company_name).to.exist;

        done();
      });
  });
  it('should be invalid if subdomain is empty', function(done) {
      var account = new Account();

      account.validate(function(err) {
        expect(err.errors.subdomain).to.exist;

        done();
      });
  });
  it('should be invalid if status is empty', function(done) {
      var account = new Account();

      account.validate(function(err) {
        expect(err.errors.status).to.exist;

        done();
      });
  });
});
