require('dotenv').config({ silent: true });

const jwt = require('jsonwebtoken');
const randtoken = require('rand-token');
const User = require('../models/user');

const SessionsController = {
  CreateSession: (req, res, next) => {
    const emailAddress = req.body.email_address;
    const password = req.body.password;

    User.findOne({ email_address: emailAddress }, (err, user) => {
      if (err) { return next(err); }

      if (!user) {
        return res.status(403).send({ success: false, minor_code: 1004, message: 'Authentication failed. User not found.' });
      }

      user.comparePassword(password, (err, isMatch) => {
        if (isMatch && !err) {
          const token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: 18000 });
          const refreshToken = randtoken.uid(256);

          user.refresh_token = refreshToken;
          user.save((err) => {
            if (err) { return next(err); }

            return res.status(200).json({
              success: true,
              token,
              refresh_token: refreshToken,
              user_id: user._id,
            });
          });
        } else {
          return res.status(403).send({ success: false, minor_code: 1005, message: 'Authentication failed.' });
        }
      });
    });
  },
  RefreshSession: (req, res, next) => {
    const refreshToken = req.body.refresh_token;

    User.findOne({ refresh_token: refreshToken }, (err, user) => {
      if (err) { return next(err); }
      if (!user) { return res.status(403).send({ success: false, minor_code: 1006, message: 'Invalid Refresh Token.' }); }

      const token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: 18000 });
      const newRefreshToken = randtoken.uid(256);

      user.refresh_token = newRefreshToken;
      user.save((err) => {
        if (err) { return next(err); }

        return res.status(200).json({
          success: true,
          token,
          refresh_token: newRefreshToken,
          user_id: user._id });
      });
    });
  },
};

module.exports = SessionsController;
