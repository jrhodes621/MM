const expect = require('chai').expect;
const Discount = require('../models/discount');

describe('Discount', () => {
  it('should be invalid if membership is empty', (done) => {
    const discount = new Discount();

    discount.validate((err) => {
      expect(err.errors.membership).to.exist;

      done();
    });
  });
  it('should be invalid if coupon is empty', (done) => {
    const discount = new Discount();

    discount.validate((err) => {
      expect(err.errors.coupon).to.exist;

      done();
    });
  });
  it('should be invalid if subscription is empty', (done) => {
    const discount = new Discount();

    discount.validate((err) => {
      expect(err.errors.subscription).to.exist;

      done();
    });
  });
  it('should be invalid if start is empty', (done) => {
    const discount = new Discount();

    discount.validate((err) => {
      expect(err.errors.start).to.exist;

      done();
    });
  });
});
