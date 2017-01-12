var expect    = require('chai').expect;
var Discount  = require('../models/discount');

describe('Discount', function(done) {
  it('should be invalid if membership is empty', function(done) {
    var discount = new Discount();

    discount.validate(function(err) {
      expect(err.errors.membership).to.exist;

      done();
    });
  });
  it('should be invalid if coupon is empty', function(done) {
    var discount = new Discount();

    discount.validate(function(err) {
      expect(err.errors.coupon).to.exist;

      done();
    });
  });
  it('should be invalid if subscription is empty', function(done) {
    var discount = new Discount();

    discount.validate(function(err) {
      expect(err.errors.subscription).to.exist;

      done();
    });
  });
  it('should be invalid if start is empty', function(done) {
    var discount = new Discount();

    discount.validate(function(err) {
      expect(err.errors.start).to.exist;

      done();
    });
  });
});
