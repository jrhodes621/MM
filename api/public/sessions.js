require('dotenv').config({ silent: true });

var express    = require('express');        // call express
var router = express.Router();              // get an instance of the express Router
var mongoose   = require('mongoose');
var jwt    = require('jsonwebtoken');
var User = require('../../models/user');

router.route('/')
  .post(function(req, res, next) {
    console.log("authenicating user");

    var email_address = req.body.email_address;
    var password = req.body.password;

    User.findOne({ email_address: req.body.email_address })
    .populate('subscriptions')
    .exec(function(err, user) {
      if (err) { return next(err); }

      if (!user) {
        return res.status(403).send({ success: false, minor_code: 1004, message: 'Authentication failed. User not found.' });
      } else {
        // check if password matches
        user.comparePassword(req.body.password, function (err, isMatch) {
          if (isMatch && !err) {
            var token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: 18000 });

            res.status(200).json({success: true, token: token, user_id: user._id });
          } else {
            return res.status(403).send({ success: false, minor_code: 1005, message: 'Authentication failed.' });
          }
        });
      }
    });
  });

module.exports = router;
