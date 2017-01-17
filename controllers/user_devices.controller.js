var User = require('../models/user');

var UserDevicesController = {
  CreateDevice: function(req, res, next) {
    var current_user = req.current_user;

    var device = {
      device_type: req.body.device_type,
      device_identifier: req.body.device_identifier,
      token: req.body.device_token
    }

    var device_found = false;
    current_user.devices.forEach(function(device) {
      if(device.device_identifier == device.device_identifier) {
        device.token = device.token;

        device_found = true;
      }
    });

    if(!device_found) {
      current_user.devices.push(device);
      User.SaveUser(current_user, function(err) {
        res.status(201).send(device);
      });
    } else {
      res.status(200).send(device);
    }
  }
}

module.exports = UserDevicesController
