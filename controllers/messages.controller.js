require('dotenv').config({ silent: true });

const Message = require('../models/message');

const MessagesController = {
  GetMessages: (req, res, next) => {
    const recipient = req.currentUser;

    Message.find({ recipient })
    .populate('sender')
    .populate({
      path: 'sender',
      populate: [{
        path: 'account',
      }],
    })
    .exec((err, messages) => {
      if (err) { next(err); }

      return res.status(200).send(messages);
    });
  },
};

module.exports = MessagesController;
