const Upload = require('s3-uploader');

const PlanServices = {
  GetPlans: (params, callback) => {
    this.paginate(params.query, params.paging, callback);
  },
  GetPlan: (params, callback) => {
    this.findById(params.plan_id, callback);
  },
  SavePlan: (plan, callback) => {
    plan.save(callback);
  },
  ArchivePlan: (plan, callback) => {
    plan.archive = true;
    plan.save(callback);
  },
  UploadAvatar: (plan, avatarPath, callback) => {
    const s3BucketName = process.env.S3_BUCKET_NAME;

    const client = new Upload(s3BucketName, {
      aws: {
        path: 'plans/' + plan._id + '/',
        region: 'us-east-1',
        acl: 'public-read',
      },
      cleanup: {
        versions: true,
        original: false,
      },
      original: {
        awsImageAcl: 'private',
      },
      versions: [{
        maxHeight: 200,
        maxWidth: 200,
        aspect: '1:1',
        format: 'png',
        suffix: '-large',
        size: 'large',
      }, {
        maxHeight: 150,
        maxWidth: 150,
        aspect: '1:1',
        format: 'png',
        suffix: '-medium',
        size: 'medium',
      }, {
        maxHeight: 80,
        maxWidth: 80,
        aspect: '1:1',
        format: 'png',
        suffix: '-small',
        size: 'small',
      }, {
        maxHeight: 40,
        maxWidth: 40,
        aspect: '1:1',
        format: 'png',
        suffix: '-thumb1',
        size: 'thumb',
      }],
    });

    client.upload(avatarPath, {}, (err, versions) => {
      if (err) { throw err; }

      const avatarImages = {};
      versions.forEach((image) => {
        if (image.size) {
          avatarImages[image.size] = image.url;
        }
      });

      callback(avatarImages);
    });
  },
};

module.exports = PlanServices;
