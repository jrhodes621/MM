const expect = require('chai').expect;
const Refund = require('../models/refund');

describe('Refund', () => {
  it('should be invalid if charge is empty', (done) => {
    const refund = new Refund();

    refund.validate((err) => {
      expect(err.errors.charge).to.exist;

      done();
    });
  });
  it('should be invalid if reference_id is empty', (done) => {
    const refund = new Refund();

    refund.validate((err) => {
      expect(err.errors.reference_id).to.exist;

      done();
    });
  });
  it('should be invalid if amount is empty', (done) => {
    const refund = new Refund();

    refund.validate((err) => {
      expect(err.errors.amount).to.exist;

      done();
    });
  });
  it('should be invalid if currency is empty', (done) => {
    const refund = new Refund();

    refund.currency = null;
    refund.validate((err) => {
      expect(err.errors.currency).to.exist;

      done();
    });
  });
  it('should be invalid if refund created is empty', (done) => {
    const refund = new Refund();

    refund.validate((err) => {
      expect(err.errors.refund_created).to.exist;

      done();
    });
  });
  it('should be invalid if status is empty', (done) => {
    const refund = new Refund();

    refund.validate((err) => {
      expect(err.errors.status).to.exist;

      done();
    });
  });
});
