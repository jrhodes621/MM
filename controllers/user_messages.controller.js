require('dotenv').config({ silent: true });

const Message = require('../models/message');

const UserMessagesController = {
  GetMessages: (req, res, next) => {
    const recipient = req.user;

    Message.find({ recipient })
    .populate('sender')
    .populate({
      path: 'sender',
      populate: [{
        path: 'account',
      }],
    })
    .populate('recipient')
    .exec((err, messages) => {
      if (err) { next(err); }

      return res.status(200).send(messages);
    });
  },
  CreateMessage: (req, res, next) => {
    const sender = req.currentUser;
    const recipient = req.user;

    const message = new Message();

    message.sender = sender;
    message.recipient = recipient;
    message.content = req.body.content;

    message.save((err) => {
      if (err) { next(err); }

      return res.status(200).send(message);
    });
  },
};

module.exports = UserMessagesController;
