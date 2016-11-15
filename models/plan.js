var mongoose = require('mongoose');
var Schema       = mongoose.Schema;
var User = require('../models/user');
var mongoosePaginate = require('mongoose-paginate');

var PlanSchema   = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  internal_id: {
    type: String
  },
  reference_id: {
    type: String
  },
  one_time_amount: {
    type: Number
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
  },
  terms_of_server: {
    type: String
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
},
{
    timestamps: true
});
PlanSchema.set('toJSON', {
    getters: true,
    virtuals: true,
    transform: function(doc, ret, options) {
        delete ret.password;
        return ret;
    }
});
PlanSchema.plugin(mongoosePaginate);

PlanSchema.virtual('member_count').get(function () {
  return this.members.length;
});

module.exports = mongoose.model('Plan', PlanSchema);
