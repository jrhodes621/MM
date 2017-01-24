const mongoose = require('mongoose');
const Upload = require('s3-uploader');

const Schema = mongoose.Schema;

const AccountSchema = new Schema({
  reference_id: {
    type: String,
  },
  company_name: {
    type: String,
    required: true,
  },
  subdomain: {
    type: String,
    required: true,
  },
  avatar: {},
  subscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription',
  },
  plans: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan',
    default: [],
  }],
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: [],
  }],
  reference_plans: [{
    reference_id: {
      type: String,
      required: true,
    },
    plan_name: {
      type: String,
      required: true,
    },
    imported: {
      type: Boolean,
      required: true,
      default: false,
    },
  }],
  status: {
    type: String,
    required: true,
  },
  stripe_connect: mongoose.Schema.Types.Mixed,
}, {
  timestamps: true,
});

AccountSchema.statics = {
  GetAccountById(accountId, callback) {
    return this.findById(accountId, callback);
  },
  SaveAccount(account, callback) {
    account.save(callback);
  },
  UploadAvatar(account, avatarPath, callback) {
    const s3BucketName = process.env.S3_BUCKET_NAME;

    const client = new Upload(s3BucketName, {
      aws: {
        path: 'account/' + account._id + '/',
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
      if (err) {
        throw err;
      }

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

module.exports = mongoose.model('Account', AccountSchema);
