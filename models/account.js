var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var Plan     = require('../models/plan');

var AccountSchema   = new Schema({
  company_name: {
    type: String,
    required: true
  },
  subdomain: {
    type: String,
    required: true
  },
  subscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan'
  },
  plans: [Plan],
  status: {
    type: String,
    required: true
  },
  stripe_connect: mongoose.Schema.Types.Mixed,
});

module.exports = mongoose.model('Account', AccountSchema);
