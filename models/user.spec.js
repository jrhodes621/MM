const expect = require('chai').expect;
const User = require('../models/user');

describe('User', () => {
  it('should be invalid if email address is empty', (done) => {
    const user = new User();

    user.validate((err) => {
      expect(err.errors.email_address).to.exist;

      done();
    });
  });
  it('should be invalid if password is empty', (done) => {
    const user = new User();

    user.validate((err) => {
      expect(err.errors.password).to.exist;

      done();
    });
  });
  it('should be invalid if status is empty', (done) => {
    const user = new User();

    user.validate((err) => {
      expect(err.errors.status).to.exist;

      done();
    });
  });
});
