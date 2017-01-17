var mongoose = require('mongoose');
var Schema       = mongoose.Schema;
var Account = require('../models/account');
var mongoosePaginate = require('mongoose-paginate');

var PlanServices = require('../models/plan.services')

var PlanSchema   = new Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  avatar: {},
  description: {
    type: String
  },
  features: [{
    type: String
  }],
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
    type: Number,
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
  terms_of_service: {
    type: String
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  archive: {
    type: Boolean,
    required: true,
    default: false
  }
},
{
    timestamps: true
});

PlanSchema.statics.GetPlans = PlanServices.GetPlans
PlanSchema.statics.GetPlan = PlanServices.GetPlan
PlanSchema.statics.SavePlan = PlanServices.SavePlan

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

var Plan = mongoose.model('Plan', PlanSchema);

module.exports = Plan;
