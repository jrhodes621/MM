var mongoose = require('mongoose');
var Schema       = mongoose.Schema;
var User = require('../models/user');
var mongoosePaginate = require('mongoose-paginate');

var MessageServices    = require('../models/message.services')

var MessageSchema = new Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  viewed: {
    type: Boolean,
    required: true,
    default: true
  },
  viewed_at: {
    type: Date
  },
  delivered_push: {
    type: Boolean,
    required: true,
    default: false
  },
  delivered_push_at: {
    type: Date,
  },
  delivered_email: {
    type: Boolean,
    required: true,
    default: false
  },
  delivered_email_at: {
    type: Date
  }
},
{
    timestamps: true
});

MessageSchema.plugin(mongoosePaginate);

MessageSchema.statics.GetPlans = MessageServices.GetMessageById
MessageSchema.statics.GetPlan = MessageServices.SaveMessage

module.exports = mongoose.model('Message', MessageSchema);
