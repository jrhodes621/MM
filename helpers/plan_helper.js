var Plan = require('../models/plan');
var async = require("async");

module.exports = {
  parsePlanFromStripe: function(plan, bull, stripe_plan, callback) {
    console.log("parsing plan from stripe " + stripe_plan.id);

    async.waterfall([
      function getPlan(callback) {
        Plan.findOne({ "reference_id": stripe_plan.id }, function(err, plan) {
          callback(err, plan);
        });
      },
      function parsePlan(plan, callback) {
        if(!plan) {
          plan = new Plan();
        }
        plan.amount = stripe_plan.amount/100;
        plan.reference_id = stripe_plan.id;
        //plan.currency = stripe_plan.currency;
        plan.interval = 0; //"month";
        plan.interval_count = stripe_plan.interval_count;
        plan.name = stripe_plan.name;
        plan.statement_descriptor = stripe_plan.statement_descriptor;
        plan.trial_period_days = stripe_plan.trial_period_days || 0;

        plan.save(function(err) {
          callback(err);
        });
      }
    ], function(err) {
      callback(err, plan);
    });
  },
  uploadAvatar: function(plan, avatar_path, callback) {
    console.log("uploading images");

    var s3BucketName = process.env.S3_BUCKET_NAME;

    var client = new Upload(s3BucketName, {
      aws: {
        path: 'plans/' + plan._id + '/',
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
