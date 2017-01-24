const expect = require('chai').expect;
const Charge = require('../models/charge');

describe('Charge', () => {
  it('should be invalid if reference_id is empty', (done) => {
    const charge = new Charge();

    charge.validate((err) => {
      expect(err.errors.reference_id).to.exist;

      done();
    });
  });
  it('should be invalid if membership is empty', (done) => {
    const charge = new Charge();

    charge.validate((err) => {
      expect(err.errors.membership).to.exist;

      done();
    });
  });
  it('should be invalid if payment card is empty', (done) => {
    const charge = new Charge();

    charge.validate((err) => {
      expect(err.errors.payment_card).to.exist;

      done();
    });
  });
  it('should be invalid if amount is empty', (done) => {
    const charge = new Charge();

    charge.validate((err) => {
      expect(err.errors.amount).to.exist;

      done();
    });
  });
  it('should be invalid if amount refunded is empty', (done) => {
    const charge = new Charge();

    charge.validate((err) => {
      expect(err.errors.amount_refunded).to.exist;

      done();
    });
  });
  it('should be invalid if charge created is empty', (done) => {
    const charge = new Charge();

    charge.validate((err) => {
      expect(err.errors.charge_created).to.exist;

      done();
    });
  });
  it('should be invalid if is captured is empty', (done) => {
    const charge = new Charge();
    charge.captured = null;

    charge.validate((err) => {
      expect(err.errors.captured).to.exist;

      done();
    });
  });
  it('should be invalid if is currency is empty', (done) => {
    const charge = new Charge();

    charge.validate((err) => {
      expect(err.errors.currency).to.exist;

      done();
    });
  });
  it('should be invalid if is status is empty', (done) => {
    const charge = new Charge();

    charge.validate((err) => {
      expect(err.errors.status).to.exist;

      done();
    });
  });
});
