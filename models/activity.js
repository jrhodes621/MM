var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var Plan         = require('../models/plan');
var User         = require('../models/user');

var ActivityServices = require('../models/activity.services')

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
    type: String
  },
  message_bull: {
    type: String
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

ActivitySchema.statics.GetAccountById = ActivityServices.GetActivities
ActivitySchema.statics.SaveAccount = ActivityServices.GetActivity
ActivitySchema.statics.UploadAvatar = ActivityServices.SaveActivity
ActivitySchema.statics.CreateActivity = ActivityServices.CreateActivity

module.exports = mongoose.model('Activity', ActivitySchema);
