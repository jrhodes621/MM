var mongoose = require('mongoose');
var Schema       = mongoose.Schema;
var Account = require('../models/account');
var Charge = require('../models/charge');
var PaymentCard = require('../models/payment_card');
var Plan = require('../models/plan');
var Subscription = require('../models/subscription');
var bcrypt = require('bcrypt');

var UserSchema   = new Schema({
  email_address: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  first_name: {
    type: String
  },
  last_name: {
    type: String
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account'
  },
  avatar: {},
  roles: [String],
  reference_id: {
    type: String
  },
  plans: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan',
    default: []
  }],
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: []
  }],
  memberships: [{
    reference_id: {
      type: String
    },
    company_name: {
      type: String
    },
    plan_names: [String],
    member_since: {
      type: Date
    },
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription',
      default: []
    }
  }],
  payment_cards: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PaymentCard',
    default: []
  }],
  charges: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Charge',
    default: []
  }],
  roles: [String],
  status: {
    type: String,
    required: true
  }
},
{
    timestamps: true
});

UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);
