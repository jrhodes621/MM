const InvoiceServices = {
  GetInvoiceById: (invoiceId, callback) => {
    this.findById(invoiceId)
    .exec(callback);
  },
  GetInvoiceByReferenceId: (referenceId, callback) => {
    this.findOne({ reference_id: referenceId })
    .exec(callback);
  },
  SaveInvoice: (invoice, callback) => {
    invoice.save(callback);
  },
};

module.exports = InvoiceServices;
