var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var Plan     = require('../models/plan');

var AccountSchema   = new Schema({
  reference_id: {
    type: String
  },
  company_name: {
    type: String,
    required: true
  },
  subdomain: {
    type: String,
    required: true
  },
  avatar: {},
  subscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan'
  },
  plans: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan',
    default: []
  }],
  reference_plans: [{
    reference_id: {
      type: String,
      required: true
    },
    plan_name: {
      type: String,
      required: true
    },
    imported: {
      type: Boolean,
      required: true,
      default: false
    }
  }],
  status: {
    type: String,
    required: true
  },
  stripe_connect: mongoose.Schema.Types.Mixed
},
{
    timestamps: true
});

module.exports = mongoose.model('Account', AccountSchema);
