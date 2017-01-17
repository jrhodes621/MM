var InvoiceServices = {
  GetInvoiceById: function(invoice_id, callback) {
    this.findById(invoice_id)
    .exec(callback);
  },
  GetInvoiceByReferenceId: function(reference_id, callback) {
    this.findOne({ "reference_id": reference_id })
    .exec(callback);
  },
  SaveInvoice: function(invoice, callback) {
    invoice.save(function(err) {
      if(err) { console.log(err); }

      callback(err);
    });
  },
}

module.exports = InvoiceServices
