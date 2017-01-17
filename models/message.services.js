var MessageServices = {
  GetMessageById: function(message_id, callback) {
    this.findById(message_id)
    .exec(callback);
  },
  SaveMessage: function(message, callback) {
    message.save(function(err) {
      if(err) { console.log(err); }

      callback(err);
    });
  },
}

module.exports = MessageServices
