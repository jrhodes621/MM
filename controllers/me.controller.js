var User = require('../models/user');
var jackrabbit = require('jackrabbit');

var MeController = {
  GetUser: function(req, res, next) {
    res.status(200).json(req.current_user);
  }
}

module.exports = MeController
