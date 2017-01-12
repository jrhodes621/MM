require('dotenv').config({ silent: true });

var Message = require('../models/message');
var User = require('../models/user');

var MessagesController = {
  GetMessages: function(req, res, next) {
    var recipient = req.current_user;

    Message.find({"recipient": recipient})
    .populate('sender')
    .populate({
      path: 'sender',
      populate: [{
        path: 'account'
      }]
    })
    .exec(function(err, messages) {
      if(err) { next(err); }

      res.status(200).send(messages);
    });
  }
}

module.exports = MessagesController
