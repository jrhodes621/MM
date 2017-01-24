var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var Plan     = require('../models/plan');

var Upload      = require('s3-uploader');
var multer      = require('multer');
var async       = require("async");

var AccountSchema   = new Schema({
  reference_id: {
    type: String
  },
  company_name: {
    type: String,
    required: true
  },
  subdomain: {
    type: String,
    required: true
  },
  avatar: {},
  subscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription'
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
  reference_plans: [{
    reference_id: {
      type: String,
      required: true
    },
    plan_name: {
      type: String,
      required: true
    },
    imported: {
      type: Boolean,
      required: true,
      default: false
    }
  }],
  status: {
    type: String,
    required: true
  },
  stripe_connect: mongoose.Schema.Types.Mixed
},
{
    timestamps: true
});

AccountSchema.statics.GetAccountById = function(account_id, callback) {
  this.findById(account_id, callback);
}
AccountSchema.statics.SaveAccount = function(account, callback) {
  account.save(function(err) {
    if(err) { console.log(err); }

    callback(err);
  });
}
AccountSchema.statics.UploadAvatar = function(account, avatar_path, callback) {
  var s3BucketName = process.env.S3_BUCKET_NAME;

  var client = new Upload(s3BucketName, {
    aws: {
      path: 'account/' + account._id + '/',
      region: 'us-east-1',
      acl: 'public-read'
    },
    cleanup: {
      versions: true,
      original: false
    },
    original: {
      awsImageAcl: 'private'
    },
    versions: [{
      maxHeight: 200,
      maxWidth: 200,
      aspect: '1:1',
      format: 'png',
      suffix: '-large',
      size: 'large'
    },{
      maxHeight: 150,
      maxWidth: 150,
      aspect: '1:1',
      format: 'png',
      suffix: '-medium',
      size: 'medium'
    },{
      maxHeight: 80,
      maxWidth: 80,
      aspect: '1:1',
      format: 'png',
      suffix: '-small',
      size: 'small'
    },{
      maxHeight: 40,
      maxWidth: 40,
      aspect: '1:1',
      format: 'png',
      suffix: '-thumb1',
      size: 'thumb'
    }]
  });

  client.upload(avatar_path, {}, function(err, versions, meta) {
    if (err) {
      throw err;
    }

    var avatar_images = {};
    versions.forEach(function(image) {
      if(image.size){
        avatar_images[image.size] = image.url;
      }
    });

    callback(avatar_images);
  });
}

module.exports = mongoose.model('Account', AccountSchema);
