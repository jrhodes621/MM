const MessageServices = {
  GetMessageById: (messageId, callback) => {
    this.findById(messageId)
    .exec(callback);
  },
  SaveMessage: (message, callback) => {
    message.save(callback);
  },
};

module.exports = MessageServices;
