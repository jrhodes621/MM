require('dotenv').config({ silent: true });

var express    = require('express');        // call express
var router = express.Router();              // get an instance of the express Router
var mongoose   = require('mongoose');
var jwt    = require('jsonwebtoken');
var User = require('../../models/user');

router.route('/')
  .post(function(req, res) {
    console.log("authenicating user");

    var email_address = req.body.email_address;
    var password = req.body.password;

    console.log(req.body.email_address);
    User.findOne({ email_address: req.body.email_address })
    .populate('subscriptions')
    .exec(function(err, user) {
      if (err) {
        console.log(err);

        return res.status(400).send(err);
      }

      if (!user) {
        console.log("user not found");

        res.send({success: false, msg: 'Authentication failed. User not found.'});
      } else {
        console.log("comparing passwords");
        // check if password matches
        user.comparePassword(req.body.password, function (err, isMatch) {
          if (isMatch && !err) {
            var token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: 18000 });

            res.status(200).json({success: true, token: token, user_id: user._id });
          } else {
            console.log("authentication failed");

            res.send({success: false, msg: 'Authentication failed. Wrong password.'});
          }
        });
      }
    });
  });

module.exports = router;
