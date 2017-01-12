var expect    = require('chai').expect;
var Invoice   = require('../models/invoice');

describe('Invoice', function(done) {
  it('should be invalid if membership is empty', function(done) {
    var invoice = new Invoice();

    invoice.membership = null;
    invoice.validate(function(err) {
      expect(err.errors.membership).to.exist;

      done();
    });
  });
  it('should be invalid if reference_id is empty', function(done) {
    var invoice = new Invoice();

    invoice.validate(function(err) {
      expect(err.errors.reference_id).to.exist;

      done();
    });
  });
  it('should be invalid if amount due is empty', function(done) {
    var invoice = new Invoice();

    invoice.validate(function(err) {
      expect(err.errors.amount_due).to.exist;

      done();
    });
  });
  it('should be invalid if attempt count is empty', function(done) {
    var invoice = new Invoice();

    invoice.attempt_count = null;
    invoice.validate(function(err) {
      expect(err.errors.attempt_count).to.exist;

      done();
    });
  });
  it('should be invalid if attempted is empty', function(done) {
    var invoice = new Invoice();

    invoice.attempted = null;
    invoice.validate(function(err) {
      expect(err.errors.attempted).to.exist;

      done();
    });
  });
  it('should be invalid if closed is empty', function(done) {
    var invoice = new Invoice();

    invoice.closed = null;
    invoice.validate(function(err) {
      expect(err.errors.closed).to.exist;

      done();
    });
  });
  it('should be invalid if currency is empty', function(done) {
    var invoice = new Invoice();

    invoice.currency = null;
    invoice.validate(function(err) {
      expect(err.errors.currency).to.exist;

      done();
    });
  });
  it('should be invalid if invoice date is empty', function(done) {
    var invoice = new Invoice();

    invoice.validate(function(err) {
      expect(err.errors.invoice_date).to.exist;

      done();
    });
  });
  it('should be invalid if ending balance is empty', function(done) {
    var invoice = new Invoice();

    invoice.ending_balance = null;
    invoice.validate(function(err) {
      expect(err.errors.ending_balance).to.exist;

      done();
    });
  });
  it('should be invalid if forgiven is empty', function(done) {
    var invoice = new Invoice();

    invoice.forgiven = null;
    invoice.validate(function(err) {
      expect(err.errors.forgiven).to.exist;

      done();
    });
  });
  it('should be invalid if paid is empty', function(done) {
    var invoice = new Invoice();

    invoice.paid = null;
    invoice.validate(function(err) {
      expect(err.errors.paid).to.exist;

      done();
    });
  });
  it('should be invalid if period end is empty', function(done) {
    var invoice = new Invoice();

    invoice.validate(function(err) {
      expect(err.errors.period_end).to.exist;

      done();
    });
  });
  it('should be invalid if period start is empty', function(done) {
    var invoice = new Invoice();

    invoice.validate(function(err) {
      expect(err.errors.period_start).to.exist;

      done();
    });
  });
  it('should be invalid if subtotal is empty', function(done) {
    var invoice = new Invoice();

    invoice.validate(function(err) {
      expect(err.errors.subtotal).to.exist;

      done();
    });
  });
  it('should be invalid if total is empty', function(done) {
    var invoice = new Invoice();

    invoice.validate(function(err) {
      expect(err.errors.total).to.exist;

      done();
    });
  });
});
