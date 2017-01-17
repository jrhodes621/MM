var mongoose      = require('mongoose');
var Schema        = mongoose.Schema;
var Account       = require('../models/account');

var StripeEventServices = require('../models/stripe_event.services')

var StripeEventSchema   = new Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
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
    required: true
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

StripeEventSchema.statics.GetStripeEventById = StripeEventServices.GetStripeEventById
StripeEventSchema.statics.SaveStripeEvent = StripeEventServices.SaveStripeEvent

module.exports = mongoose.model('StripeEvent', StripeEventSchema);
