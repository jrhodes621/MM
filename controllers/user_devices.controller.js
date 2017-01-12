var User = require('../models/user');

var UserDevicesController = {
  CreateDevice: function(req, res, next) {
    var current_user = req.current_user;

    var device = {
      device_type: req.body.device_type,
      device_identifier: req.body.device_identifier,
      token: req.body.device_token
    }

    User.AddDevice(current_user, device, function(err) {
      if(err) { return next(err); }

      res.status(201).send(current_user);
    });
  }
}

module.exports = UserDevicesController
