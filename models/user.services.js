var StripeServices = require('../services/stripe.services');
var multer  = require('multer');
var Upload = require('s3-uploader');
var fs = require('fs');
var async = require("async");

var UserServices = {
  GetUserById: function(user_id, callback) {
    this.findById(user_id)
    .exec(callback);
  },
  GetUserByEmailAddress: function(email_address, callback) {
    User.findOne({ email_address: req.body.email_address })
    .populate('subscriptions')
    .exec(callback)
  },
  SaveUser: function(user, callback) {
    user.save(function(err) {
      if(err) { console.log(err); }

      callback(err);
    });
  },
  UploadAvatar: function(user, avatar_path, callback) {
    var s3BucketName = process.env.S3_BUCKET_NAME;

    var client = new Upload(s3BucketName, {
      aws: {
        path: 'users/' + user._id + '/',
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
  },
  ParseReferencePlans: function(user, reference_id, callback) {
    async.waterfall([
      function getPlan(callback) {
        Plan.findOne({ "reference_id": reference_id, "user": user })
        .exec(function(err, plan) {
          callback(err, plan);
        });
      },
      function parsePlan(plan, callback) {
        if(!plan) {
          module.exports.createPlan(user, reference_id, function(err, plan) {
            callback(err, plan);
          });
        } else {
          callback(null, plan);
        }
      }
    ], function(err, plan) {
      callback(err, plan)
    });
  }
}

module.exports = UserServices
