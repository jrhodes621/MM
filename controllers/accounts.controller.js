var Account = require('../models/account');
var User = require('../models/user');

var AccountsController = {
  UpdateAccount: function(req, res, next) {
    var current_user = req.current_user;

    current_user.account.company_name = req.body.company_name;
    current_user.account.subdomain = req.body.subdomain;

    if(req.file) {
      AccountHelper.uploadAvatar(current_user.account, req.file.path, function(avatar_images) {
        current_user.account.avatar = avatar_images;
        Account.SaveAccount(current_user.account, function(err) {
          if(err) { return next(err); }

          res.json(current_user.account);
        });
      });
    } else {
      Account.SaveAccount(current_user.account, function(err) {
        if(err) { return next(err); }

        res.json(current_user.account);
      });
    }
  }
}

module.exports = AccountsController
