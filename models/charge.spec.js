var expect    = require('chai').expect;
var Charge   = require('../models/charge');

describe('Charge', function(done) {
  it('should be invalid if reference_id is empty', function(done) {
      var charge = new Charge();

      charge.validate(function(err) {
        expect(err.errors.reference_id).to.exist;

        done();
      });
  });
  it('should be invalid if membership is empty', function(done) {
      var charge = new Charge();

      charge.validate(function(err) {
        expect(err.errors.membership).to.exist;

        done();
      });
  });
  it('should be invalid if payment card is empty', function(done) {
      var charge = new Charge();

      charge.validate(function(err) {
        expect(err.errors.payment_card).to.exist;

        done();
      });
  });
  it('should be invalid if amount is empty', function(done) {
    var charge = new Charge();

      charge.validate(function(err) {
        expect(err.errors.amount).to.exist;

        done();
      });
  });
  it('should be invalid if amount refunded is empty', function(done) {
    var charge = new Charge();

      charge.validate(function(err) {
        expect(err.errors.amount_refunded).to.exist;

        done();
      });
  });
  it('should be invalid if charge created is empty', function(done) {
    var charge = new Charge();

      charge.validate(function(err) {
        expect(err.errors.charge_created).to.exist;

        done();
      });
  });
  it('should be invalid if is captured is empty', function(done) {
    var charge = new Charge();
      charge.captured = null;

      charge.validate(function(err) {
        expect(err.errors.captured).to.exist;

        done();
      });
  });
  it('should be invalid if is currency is empty', function(done) {
    var charge = new Charge();

      charge.validate(function(err) {
        expect(err.errors.currency).to.exist;

        done();
      });
  });
  it('should be invalid if is status is empty', function(done) {
    var charge = new Charge();

      charge.validate(function(err) {
        expect(err.errors.status).to.exist;

        done();
      });
  });
});
