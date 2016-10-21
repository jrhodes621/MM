var mongoose = require('mongoose');
var Schema       = mongoose.Schema;
var User = require('../models/user');

var PlanSchema   = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  },
  internal_id: {
    type: String
  },
  reference_id: {
    type: String
  },
  amount: {
    type: Number,
    required: true
  },
  interval: {
    type: String,
    required: true
  },
  interval_count: {
    type: Number,
    required: true
  },
  statement_descriptor: {
    type: String
  },
  trial_period_days: {
    type: Number,
    required: true,
    default: 0
  },
  statement_description: {
    type: String
  }
});

module.exports = mongoose.model('Plan', PlanSchema);
