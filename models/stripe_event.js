var mongoose = require('mongoose');
var Schema       = mongoose.Schema;

var StripeEventSchema   = new Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account'
  },
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
  },
  processed: {
    type: Boolean,
    required: true,
    default: false
  }
},
{
    timestamps: true
});

  module.exports = mongoose.model('StripeEvent', StripeEventSchema);
