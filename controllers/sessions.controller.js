require('dotenv').config({ silent: true });

var jwt    = require('jsonwebtoken');
var randtoken = require('rand-token')
var User = require('../models/user');

var SessionsController = {
  CreateSession: function(req, res, next) {
    var email_address = req.body.email_address;
    var password = req.body.password;

    User.GetUserByEmailAddress(email_address, function(err, user) {
      if (err) { return next(err); }

      if (!user) {
        return res.status(403).send({ success: false, minor_code: 1004, message: 'Authentication failed. User not found.' });
      } else {
        // check if password matches
        user.comparePassword(req.body.password, function (err, isMatch) {
          if (isMatch && !err) {
            var token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: 18000 });
            var refresh_token = randtoken.uid(256)

            user.refresh_token = refresh_token;
            user.save(function(err) {
              if(err) { return next(err); }

              res.status(200).json({success: true, token: token, refresh_token: refresh_token, user_id: user._id });
            });
          } else {
            return res.status(403).send({ success: false, minor_code: 1005, message: 'Authentication failed.' });
          }
        });
      }
    });
  },
  RefreshSession: function(req, res, next) {
    var refresh_token = req.body.refresh_token;

    User.findOne({ "refresh_token": refresh_token }, function(err, user) {
      if(err) { return next(err); }
      if(!user) { return res.status(403).send({ success: false, minor_code: 1006, message: 'Invalid Refresh Token.' }); }

      var token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: 18000 });
      var refresh_token = randtoken.uid(256)

      user.refresh_token = refresh_token;
      user.save(function(err) {
        if(err) { return next(err); }

        res.status(200).json({success: true, token: token, refresh_token: refresh_token, user_id: user._id });
      });
    });
  }
}

module.exports = SessionsController
