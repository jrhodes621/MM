const Account = require('../models/account');

const AccountsController = {
  UpdateAccount: (req, res, next) => {
    const currentUser = req.currentUser;

    currentUser.account.company_name = req.body.company_name;
    currentUser.account.subdomain = req.body.subdomain;

    if (req.file) {
      Account.UploadAvatar(currentUser.account, req.file.path, (avatarImages) => {
        currentUser.account.avatar = avatarImages;
        Account.SaveAccount(currentUser.account, (err) => {
          if (err) { return next(err); }

          return res.json(currentUser.account);
        });
      });
    } else {
      Account.SaveAccount(currentUser.account, (err) => {
        if (err) { return next(err); }

        return res.json(currentUser.account);
      });
    }
  },
};

module.exports = AccountsController;
