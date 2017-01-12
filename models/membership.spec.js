var expect      = require('chai').expect;
var Membership  = require('../models/membership');

describe('Membership', function(done) {
  it('should be invalid if user is empty', function(done) {
    var membership = new Membership();

    membership.validate(function(err) {
      expect(err.errors.user).to.exist;

      done();
    });
  });
  it('should be invalid if account is empty', function(done) {
    var membership = new Membership();

    membership.validate(function(err) {
      expect(err.errors.account).to.exist;

      done();
    });
  });
  it('should be invalid if member since is empty', function(done) {
    var membership = new Membership();

    membership.validate(function(err) {
      expect(err.errors.member_since).to.exist;

      done();
    });
  });
});
