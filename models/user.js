const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const bcrypt = require('bcrypt');
const UserServices = require('../models/user.services');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email_address: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
  },
  avatar: {},
  memberships: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Membership',
    default: [],
  }],
  payment_cards: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PaymentCard',
    default: [],
  }],
  charges: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Charge',
    default: [],
  }],
  roles: [{
    type: String,
    unique: true,
  }],
  status: {
    type: String,
    required: true,
  },
  refresh_token: {
    type: String,
  },
  devices: [{
    device_type: {
      type: String,
      required: true,
      default: 'iPhone',
    },
    device_identifier: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
  }],
}, {
  timestamps: true,
});

UserSchema.pre('save', (next) => {
  const user = this;

  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) { return next(err); }

      bcrypt.hash(user.password, salt, (err2, hash) => {
        if (err2) { return next(err2); }

        user.password = hash;
        return next();
      });
    });
  } else {
    return next();
  }
});

UserSchema.methods = {
  comparePassword(passw, callback) {
    bcrypt.compare(passw, this.password, (err, isMatch) => {
      if (err) { return callback(err); }

      callback(null, isMatch);
    });
  },
  UpdateUser(callback) {
    this.save(callback);
  },
};
UserSchema.statics = {
  GetUserById: UserServices.GetUserById,
  GetUserByEmailAddress: UserServices.GetUserByEmailAddress,
  SaveUser: UserServices.SaveUser,
  UploadAvatar: UserServices.UploadAvatar,
  ParseReferencePlans: UserServices.ParseReferencePlans,
};

UserSchema.set('toJSON', {
  getters: true,
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.password;

    return ret;
  },
});
UserSchema.virtual('member_count').get(() => {
  let length = 0;

  if (this.members) {
    length = this.members.length;
  }

  return length;
});
// UserSchema.virtual('gravatar_url').get(function() {
//   return gravatar.url(this.email_address, {s: '100', r: 'x', d: 'retro'}, true);
// });
UserSchema.plugin(mongoosePaginate);

const User = mongoose.model('User', UserSchema);

module.exports = User;
