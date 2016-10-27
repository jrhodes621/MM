var mongoose = require('mongoose');
var Schema       = mongoose.Schema;

var PaymentCardSchema   = new Schema({
  reference_id: {
    type: String,
    required: true
  },
  name: {
    type: String,
  },
  brand: {
    type: String,
    required: true
  },
  last4: {
    type: String,
    required: true
  },
  exp_month: {
    type: Number,
    required: true
  },
  exp_year: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true
  }
},
{
    timestamps: true
});

module.exports = mongoose.model('PaymentCard', PaymentCardSchema);
