const InvoiceItemServices = {
  GetInvoiceById: function(invoiceItemId, callback) {
    this.findById(invoiceItemId)
    .exec(callback);
  },
  SaveInvoiceItem: (invoiceItem, callback) => {
    invoiceItem.save(callback);
  },
};

module.exports = InvoiceItemServices;
