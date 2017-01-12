require('dotenv').config({ silent: true });

var Message = require('../models/message');
var User = require('../models/user');
var StripeServices = require('../services/stripe.services');

var UserMessagesController = {
  GetMessages: function(req, res, next) {
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
  },
  CreateMessage: function(req, res, next) {
    var sender = req.current_user;
    var recipient = req.user;

    var message = new Message();

    message.sender = sender;
    message.recipient = recipient;
    message.content = req.body.content;

    message.save(function(err) {
      if(err) { next(err); }

      res.status(200).send(message);
    });
  }
}

module.exports = UserMessagesController
