var expect    = require('chai').expect;
var InvoiceItem  = require('../models/invoice_item');

describe('Invoice Item', function(done) {
  it('should be invalid if amount is empty', function(done) {
    var invoice_item = new InvoiceItem();

    invoice_item.validate(function(err) {
      expect(err.errors.amount).to.exist;

      done();
    });
  });
  it('should be invalid if currency is empty', function(done) {
    var invoice_item = new InvoiceItem();

    invoice_item.currency = null;
    invoice_item.validate(function(err) {
      expect(err.errors.currency).to.exist;

      done();
    });
  });
  it('should be invalid if discountable is empty', function(done) {
    var invoice_item = new InvoiceItem();

    invoice_item.discountable = null;
    invoice_item.validate(function(err) {
      expect(err.errors.discountable).to.exist;

      done();
    });
  });
  it('should be invalid if proration is empty', function(done) {
    var invoice_item = new InvoiceItem();

    invoice_item.proration = null;
    invoice_item.validate(function(err) {
      expect(err.errors.proration).to.exist;

      done();
    });
  });
  it('should be invalid if proration is empty', function(done) {
    var invoice_item = new InvoiceItem();

    invoice_item.validate(function(err) {
      expect(err.errors.invoice_line_item_type).to.exist;

      done();
    });
  });
});
