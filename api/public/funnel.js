require('dotenv').config({ silent: true });

var express    = require('express');        // call express
var router = express.Router();              // get an instance of the express Router
var mongoose   = require('mongoose');
var jwt    = require('jsonwebtoken');
var User = require('../../models/user');
var randomstring = require("randomstring");

router.route('')
  .post(function(req, res) {
    var user = new User();
    var full_name = req.body.name;
 
    var name = full_name.split(" ");
    var first_name = name[0];
    var last_name = name[1];
    var email_address = "user+" + randomstring.generate() + "@membermoose.com";
    var password = "password";

    user.first_name = first_name;
    user.last_name = last_name;
    user.email_address = email_address;
    user.password = password;

    user.roles.push("Bull");

    user.save(function(err) {
      if(err)
        return res.status(400).send(err);

      var token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: 18000 });

      res.status(200).json({success: true, token: token, user: user});
    });
  });

module.exports = router;
