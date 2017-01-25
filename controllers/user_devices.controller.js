const User = require('../models/user');

const UserDevicesController = {
  CreateDevice: (req, res, next) => {
    const currentUser = req.currentUser;
    const device = {
      device_type: req.body.device_type,
      device_identifier: req.body.device_identifier,
      token: req.body.device_token,
    };

    let deviceFound = false;
    currentUser.devices.forEach((userDevice) => {
      if (device.device_identifier === userDevice.device_identifier) {
        device.token = device.token;

        deviceFound = true;
      }
    });

    if (!deviceFound) {
      currentUser.devices.push(device);
      User.SaveUser(currentUser, (err) => {
        if (err) { next(err); }

        res.status(201).send(device);
      });
    } else {
      res.status(200).send(device);
    }
  },
};

module.exports = UserDevicesController;
