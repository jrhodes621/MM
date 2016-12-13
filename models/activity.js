var mongoose = require('mongoose');
var Schema       = mongoose.Schema;
var Plan = require('../models/plan');
var User = require('../models/user');

var ActivitySchema   = new Schema({
  bull: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  calf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    required: true
  },
  message_calf: {
    type: String,
    required: true
  },
  message_bull: {
    type: String,
    required: true
  },
  received_at: {
    type: Date
  },
  source: {
    type: String
  },
},
{
    timestamps: true
});

module.exports = mongoose.model('Activity', ActivitySchema);
