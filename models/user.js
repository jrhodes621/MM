var mongoose = require('mongoose');
var Schema       = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var bcrypt = require('bcrypt');

var UserServices = require('../models/user.services')

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
  memberships: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Membership',
    default: []
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
  roles: [{
    type: String,
    unique: true
  }],
  status: {
    type: String,
    required: true
  },
  refresh_token: {
    type: String
  },
  devices: [{
    device_type: {
      type: String,
      required: true,
      default: "iPhone"
    },
    device_identifier: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
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
UserSchema.methods.UpdateUser = function(callback) {
  this.save(function(err) {
    callback(err)
  });
}
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
// UserSchema.virtual('gravatar_url').get(function() {
//   return gravatar.url(this.email_address, {s: '100', r: 'x', d: 'retro'}, true);
// });
UserSchema.plugin(mongoosePaginate);

UserSchema.statics.GetUserById = UserServices.GetUserById
UserSchema.statics.GetUserByEmailAddress = UserServices.GetUserByEmailAddress
UserSchema.statics.SaveUser = UserServices.SaveUser
UserSchema.statics.UploadAvatar = UserServices.UploadAvatar
UserSchema.statics.ParseReferencePlans = UserServices.ParseReferencePlans

var User = mongoose.model('User', UserSchema)

module.exports = User;
