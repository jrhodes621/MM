//send a message to a specific user
//get messages for a specific user

require('dotenv').config({ silent: true });

var express    = require('express');        // call express
var router = express.Router();              // get an instance of the express Router
var mongoose   = require('mongoose');
var jwt    = require('jsonwebtoken');
var Message = require('../../models/message');
var User = require('../../models/user');
var StripeManager = require("../../helpers/stripe_manager");

router.route('')
  .get(function(req, res, next) {
    var recipient = req.current_user;

    Message.find({"recipient": recipient})
    .populate('sender')
    .exec(function(err, messages) {
      if(err) { next(err); }

      res.status(200).send(messages);
    });
  })

module.exports = router;
