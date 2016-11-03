var multer  = require('multer');
var Upload = require('s3-uploader');
var AvatarGenerator = require('initials-avatar-generator').AvatarGenerator;
var Upload = require('s3-uploader');
var fs = require('fs');

module.exports = {
  uploadInitialsAvatar: function createInitialAvatar(user, callback) {
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
    var initials = user.email_address.substring(0, 1);
    var indexOfAtSymbol = user.email_address.indexOf("@");
    var indexOfDotSeperator = user.email_address.indexOf(".");
    var indexOfUnderScoreSeperator = user.email_address.indexOf("_");

    if(indexOfDotSeperator > 0 && indexOfDotSeperator < (indexOfAtSymbol - 1)) {
      initials += user.email_address.charAt(indexOfDotSeperator+1);
    } else if (indexOfUnderScoreSeperator > 0  && indexOfUnderScoreSeperator < (indexOfAtSymbol - 1)) {
      initials += user.email_address.charAt(indexOfUnderScoreSeperator+1);
    }
    if(user.first_name && user.last_name) {
      initials = user.first_name.substring(0, 1) + user.last_name.substring(0, 1);
    }
    var filename = "avatar_image_" + user._id  + ".png";
    var option = {
      width: 120,
      height: 120,
      text: initials,
      color: '#EA6B2F'
    };

    var avatarGenerator = new AvatarGenerator();
    avatarGenerator.generate(option, function (image) {
      image
        .stream('png')
        .pipe(fs.createWriteStream(filename)).on('close', function() {
          client.upload(filename, {}, function(err, versions, meta) {
            if (err) {
              callback(err, user);
            }

            var avatar_images = {};
            versions.forEach(function(image) {
              if(image.size){
                avatar_images[image.size] = image.url;
              }
            });

            user.avatar = avatar_images;

            try {
              fs.unlinkSync(filename);
            } catch(err) {
              console.log(err);
            }

            callback(err, user);
          });
        });
    });
  },
  uploadAvatar: function(user, avatar_path, callback) {
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
  }
};
