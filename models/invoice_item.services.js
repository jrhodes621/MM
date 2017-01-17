var InvoiceItemServices = {
  GetInvoiceById: function(invoice_item_id, callback) {
    this.findById(invoice_item_id)
    .exec(callback);
  },
  SaveInvoiceItem: function(coupon, callback) {
    this.save(function(err) {
      if(err) { console.log(err); }

      callback(err);
    });
  },
}

module.exports = InvoiceItemServices
