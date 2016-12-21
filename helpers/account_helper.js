var multer  = require('multer');
var Upload = require('s3-uploader');
var multer  = require('multer');
var Account = require('../models/account');

module.exports = {
  getAccount: function(account_id, callback) {
    Account.findById(account_id, function(err, account) {
      callback(err, account);
    });
  },
  uploadAvatar: function(account, avatar_path, callback) {
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
};
