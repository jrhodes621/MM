const expect = require('chai').expect;
const Membership = require('../models/membership');

describe('Membership', () => {
  it('should be invalid if user is empty', (done) => {
    const membership = new Membership();

    membership.validate((err) => {
      expect(err.errors.user).to.exist;

      done();
    });
  });
  it('should be invalid if account is empty', (done) => {
    const membership = new Membership();

    membership.validate((err) => {
      expect(err.errors.account).to.exist;

      done();
    });
  });
  it('should be invalid if member since is empty', (done) => {
    const membership = new Membership();

    membership.validate((err) => {
      expect(err.errors.member_since).to.exist;

      done();
    });
  });
});
