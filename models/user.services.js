var StripeServices = require('../services/stripe.services');
var multer  = require('multer');
var Upload = require('s3-uploader');
var fs = require('fs');
var async = require("async");

var UserServices = {
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
  AddDevice: function(user, new_device, callback) {
    var device_found = false;
    this.devices.forEach(function(device) {
      if(device.device_identifier == new_device.device_identifier) {
        device.token = new_device.token;

        device_found = true;
      }
    });

    this.devices.push(new_device);
    this.save(function(err) {
      callback(err)
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
  },
  CreatePlan: function(user, reference_id, callback) {
    var stripe_api_key = user.account.stripe_connect.access_token;

    async.waterfall([
      function getPlan(callback) {
        StripeServices.getPlan(stripe_api_key, reference_id, callback);
      },
      function convertRecurringInterval(stripe_plan, callback) {
        transformRecurringInterval(stripe_plan, function(err, recurring_interval) {
          callback(err, stripe_plan, recurring_interval);
        });
      },
      function parsePlan(stripe_plan, recurring_interval, callback) {
        var plan = new Plan();

        plan.user = user._id;
        plan.name = stripe_plan.name;
        plan.reference_id = stripe_plan.id;
        plan.amount = stripe_plan.amount/100;
        plan.created = stripe_plan.created;
        plan.currency = stripe_plan.currency;
        plan.interval = recurring_interval;
        plan.interval_count = stripe_plan.interval_count;
        plan.statement_descriptor = stripe_plan.statement_descriptor;
        plan.trial_period_days = stripe_plan.trial_period_days || 0;

        plan.save(function(err) {
          callback(err, plan);
        });
      }
    ], function(err, plan) {
      callback(err, plan);
    });
  }
}

module.exports = UserServices
