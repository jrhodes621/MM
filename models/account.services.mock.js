var AccountServices = {
  GetAccountById: function(params, callback) {
    callback(null, AccountFixtures.account);
  },
  SaveAccount: function(account, callback) {
    callback(null);
  }
}

module.exports = AccountServices
