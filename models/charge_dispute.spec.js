const expect = require('chai').expect;
const ChargeDispute = require('../models/charge_dispute');

describe('Charge Dispute', () => {
  it('should be invalid if reference_id is empty', (done) => {
    const chargeDispute = new ChargeDispute();

    chargeDispute.validate((err) => {
      expect(err.errors.reference_id).to.exist;

      done();
    });
  });
  it('should be invalid if charge is empty', (done) => {
    const chargeDispute = new ChargeDispute();

    chargeDispute.validate((err) => {
      expect(err.errors.charge).to.exist;

      done();
    });
  });
  it('should be invalid if amount is empty', (done) => {
    const chargeDispute = new ChargeDispute();

    chargeDispute.validate((err) => {
      expect(err.errors.amount).to.exist;

      done();
    });
  });
  it('should be invalid if dispute created is empty', (done) => {
    const chargeDispute = new ChargeDispute();

    chargeDispute.validate((err) => {
      expect(err.errors.dispute_created).to.exist;

      done();
    });
  });
  it('should be invalid if is charge refundable is empty', (done) => {
    const chargeDispute = new ChargeDispute();
    chargeDispute.is_charge_refundable = null;

    chargeDispute.validate((err) => {
      expect(err.errors.is_charge_refundable).to.exist;

      done();
    });
  });
  it('should be invalid if is reason is empty', (done) => {
    const chargeDispute = new ChargeDispute();

    chargeDispute.validate((err) => {
      expect(err.errors.reason).to.exist;

      done();
    });
  });
  it('should be invalid if is status is empty', (done) => {
    const chargeDispute = new ChargeDispute();

    chargeDispute.validate((err) => {
      expect(err.errors.status).to.exist;

      done();
    });
  });
});
