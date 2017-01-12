var expect       = require('chai').expect;
var Refund       = require('../models/refund');

describe('Refund', function(done) {
  it('should be invalid if charge is empty', function(done) {
    var refund = new Refund();

    refund.validate(function(err) {
      expect(err.errors.charge).to.exist;

      done();
    });
  });
  it('should be invalid if reference_id is empty', function(done) {
    var refund = new Refund();

    refund.validate(function(err) {
      expect(err.errors.reference_id).to.exist;

      done();
    });
  });
  it('should be invalid if amount is empty', function(done) {
    var refund = new Refund();

    refund.validate(function(err) {
      expect(err.errors.amount).to.exist;

      done();
    });
  });
  it('should be invalid if currency is empty', function(done) {
    var refund = new Refund();

    refund.currency = null;
    refund.validate(function(err) {
      expect(err.errors.currency).to.exist;

      done();
    });
  });
  it('should be invalid if refund created is empty', function(done) {
    var refund = new Refund();

    refund.validate(function(err) {
      expect(err.errors.refund_created).to.exist;

      done();
    });
  });
  it('should be invalid if status is empty', function(done) {
    var refund = new Refund();

    refund.validate(function(err) {
      expect(err.errors.status).to.exist;

      done();
    });
  });
});
