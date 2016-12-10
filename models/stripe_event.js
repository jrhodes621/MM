var mongoose = require('mongoose');
var Schema       = mongoose.Schema;

var StripeEventSchema   = new Schema({
  event_id: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  livemode: {
    type: Boolean,
    required: true
  },
  raw_object: {
    type: Schema.Types.Mixed,
    require: true
  }
},
{
    timestamps: true
});

  module.exports = mongoose.model('StripeEvent', StripeEventSchema);
