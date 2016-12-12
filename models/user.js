var mongoose = require('mongoose');
var Schema       = mongoose.Schema;
var Account = require('../models/account');
var Charge = require('../models/charge');
var Membership = require('../models/membership');
var PaymentCard = require('../models/payment_card');
var Plan = require('../models/plan');
var Subscription = require('../models/subscription');
var mongoosePaginate = require('mongoose-paginate');
var bcrypt = require('bcrypt');
var gravatar = require('gravatar');

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
  memberships: [Membership.schema],
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
UserSchema.set('toJSON', {
    getters: true,
    virtuals: true,
    transform: function(doc, ret, options) {
        delete ret.password;
        return ret;
    }
});
UserSchema.virtual('member_count').get(function () {
  return this.members.length;
});
UserSchema.virtual('gravatar_url').get(function() {
  return gravatar.url(this.email_address, {s: '100', r: 'x', d: 'retro'}, true);
});
UserSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('User', UserSchema);
