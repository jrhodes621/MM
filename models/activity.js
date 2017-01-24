const mongoose = require('mongoose');
const ActivityServices = require('../models/activity.services');

const Schema = mongoose.Schema;

const ActivitySchema = new Schema({
  bull: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  calf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  type: {
    type: String,
    required: true,
  },
  message_calf: {
    type: String,
  },
  message_bull: {
    type: String,
  },
  received_at: {
    type: Date,
  },
  source: {
    type: String,
  },
}, {
  timestamps: true,
});

ActivitySchema.statics = {
  GetAccountById: ActivityServices.GetActivities,
  SaveAccount: ActivityServices.GetActivity,
  UploadAvatar: ActivityServices.SaveActivity,
  CreateActivity: ActivityServices.CreateActivity,
};

module.exports = mongoose.model('Activity', ActivitySchema);
