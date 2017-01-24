const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const PlanServices = require('../models/plan.services');

const Schema = mongoose.Schema;

const PlanSchema = new Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  avatar: {},
  description: {
    type: String,
  },
  features: [{
    type: String,
  }],
  internal_id: {
    type: String,
  },
  reference_id: {
    type: String,
  },
  one_time_amount: {
    type: Number,
  },
  amount: {
    type: Number,
    required: true,
  },
  interval: {
    type: Number,
    required: true,
  },
  interval_count: {
    type: Number,
    required: true,
  },
  statement_descriptor: {
    type: String,
  },
  trial_period_days: {
    type: Number,
    required: true,
    default: 0,
  },
  statement_description: {
    type: String,
  },
  terms_of_service: {
    type: String,
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  archive: {
    type: Boolean,
    required: true,
    default: false,
  },
}, {
  timestamps: true,
});

PlanSchema.statics = {
  GetPlans: PlanServices.GetPlans,
  GetPlan: PlanServices.GetPlan,
  SavePlan: PlanServices.SavePlan,
};

PlanSchema.set('toJSON', {
  getters: true,
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});
PlanSchema.plugin(mongoosePaginate);

PlanSchema.virtual('member_count').get(() => {
  return this.members.length;
});

const Plan = mongoose.model('Plan', PlanSchema);

module.exports = Plan;
