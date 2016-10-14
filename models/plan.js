var mongoose = require('mongoose');
var Schema       = mongoose.Schema;

var PlanSchema   = new Schema({
  name: {
    type: String,
    required: true
  },
  reference_id: {
    type: String,
    required: true
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
