const expect = require('chai').expect;
const Account = require('../models/account');

describe('Account', () => {
  it('should be invalid if company_name is empty', (done) => {
    const account = new Account();

    account.validate((err) => {
      expect(err.errors.company_name).to.exist;

      done();
    });
  });
  it('should be invalid if subdomain is empty', (done) => {
    const account = new Account();

    account.validate((err) => {
      expect(err.errors.subdomain).to.exist;

      done();
    });
  });
  it('should be invalid if status is empty', (done) => {
    const account = new Account();

    account.validate((err) => {
      expect(err.errors.status).to.exist;

      done();
    });
  });
});
