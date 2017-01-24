const expect = require('chai').expect;
const Coupon = require('../models/coupon');

describe('Coupon', () => {
  it('should be invalid if reference_id is empty', (done) => {
    const coupon = new Coupon();

    coupon.validate((err) => {
      expect(err.errors.reference_id).to.exist;

      done();
    });
  });
  it('should be invalid if coupon is empty', (done) => {
    const coupon = new Coupon();

    coupon.validate((err) => {
      expect(err.errors.account).to.exist;

      done();
    });
  });
  it('should be invalid if coupon created is empty', (done) => {
    const coupon = new Coupon();

    coupon.validate((err) => {
      expect(err.errors.coupon_created).to.exist;

      done();
    });
  });
  it('should be invalid if is currency is empty', (done) => {
    const coupon = new Coupon();

    coupon.validate((err) => {
      expect(err.errors.currency).to.exist;

      done();
    });
  });
  it('should be invalid if duration is empty', (done) => {
    const coupon = new Coupon();

    coupon.validate((err) => {
      expect(err.errors.duration).to.exist;

      done();
    });
  });
  it('should be invalid if times redeemed is empty', (done) => {
    const coupon = new Coupon();

    coupon.times_redeemed = null;
    coupon.validate((err) => {
      expect(err.errors.times_redeemed).to.exist;

      done();
    });
  });
  it('should be invalid if valid is empty', (done) => {
    const coupon = new Coupon();

    coupon.valid = null;
    coupon.validate((err) => {
      expect(err.errors.valid).to.exist;

      done();
    });
  });
});
