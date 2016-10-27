var express    = require('express');        // call express
var router = express.Router();              // get an instance of the express Router
var mongoose   = require('mongoose');
var Upload = require('s3-uploader');
var multer  = require('multer');
var AccountHelper = require('../../helpers/account_helper');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null,  file.originalname );
  }
});
var upload = multer({ storage: storage  });

// on routes that end in /me
// ----------------------------------------------------
router.route('')
  .put(upload.single('file'), function(req, res, next) {
    var current_user = req.current_user;

    current_user.account.company_name = req.body.company_name;
    current_user.account.subdomain = req.body.subdomain;

    if(req.file) {
      AccountHelper.uploadAvatar(current_user.account, req.file.path, function(avatar_images) {
        current_user.account.avatar = avatar_images;
        current_user.account.save(function(err) {
          if(err) { return next(err); }

          res.json(current_user.account);
        });
      });
    } else {
      current_user.account.save(function(err) {
        if(err) { return next(err); }

        res.json(current_user.account);
      });
    }
  });

  module.exports = router;
