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
    var sender = req.current_user;
    var recipient = req.user;

    Message.find({"recipient": recipient})
    .populate('sender')
    .populate({
      path: 'sender',
      populate: [{
        path: 'account'
      }]
    })
    .populate('recipient')
    .exec(function(err, messages) {
      if(err) { next(err); }

      res.status(200).send(messages);
    });
  })
  .post(function(req, res, next) {
    console.log("posting new message");

    var sender = req.current_user;
    var recipient = req.user;

    var message = new Message();

    message.sender = sender;
    message.recipient = recipient;
    message.content = req.body.content;

    message.save(function(err) {
      if(err) { next(err); }

      res.status(200).send(message);
    })
  });

module.exports = router;
