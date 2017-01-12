var expect  = require('chai').expect;
var User    = require('../models/user');

describe('User', function(done) {
  it('should be invalid if email address is empty', function(done) {
    var user = new User();

    user.validate(function(err) {
      expect(err.errors.email_address).to.exist;

      done();
    });
  });
  it('should be invalid if password is empty', function(done) {
    var user = new User();

    user.validate(function(err) {
      expect(err.errors.password).to.exist;

      done();
    });
  });
  it('should be invalid if status is empty', function(done) {
    var user = new User();

    user.validate(function(err) {
      expect(err.errors.status).to.exist;

      done();
    });
  });
});
