var User = require('../models/user');

var MeController = {
  GetUser: function(req, res, next) {
    res.json(req.current_user);
  }
}

module.exports = MeController
