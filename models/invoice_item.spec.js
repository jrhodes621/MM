const expect = require('chai').expect;
const InvoiceItem = require('../models/invoice_item');

describe('Invoice Item', () => {
  it('should be invalid if amount is empty', (done) => {
    const invoiceItem = new InvoiceItem();

    invoiceItem.validate((err) => {
      expect(err.errors.amount).to.exist;

      done();
    });
  });
  it('should be invalid if currency is empty', (done) => {
    const invoiceItem = new InvoiceItem();

    invoiceItem.currency = null;
    invoiceItem.validate((err) => {
      expect(err.errors.currency).to.exist;

      done();
    });
  });
  it('should be invalid if discountable is empty', (done) => {
    const invoiceItem = new InvoiceItem();

    invoiceItem.discountable = null;
    invoiceItem.validate((err) => {
      expect(err.errors.discountable).to.exist;

      done();
    });
  });
  it('should be invalid if proration is empty', (done) => {
    const invoiceItem = new InvoiceItem();

    invoiceItem.proration = null;
    invoiceItem.validate((err) => {
      expect(err.errors.proration).to.exist;

      done();
    });
  });
  it('should be invalid if proration is empty', (done) => {
    const invoiceItem = new InvoiceItem();

    invoiceItem.validate((err) => {
      expect(err.errors.invoice_line_item_type).to.exist;

      done();
    });
  });
});
