var async = require("async");
var ActivityHelper =
var PushNotificationHelper =
var User
module.exports = {
  notifyUsers: function(notification_type, bull, calf, plan, message_bull, message_calf, source, received_at, callback) {
    var payload;

    var activities = [];
    User.find({ "account": bull }, function(err, users) {
      async.eachSeries(users, function(users, callback) {
        var devices = bull_user.devices;
        devices.forEach(function(device) {
          PushNotificationHelper.sendPushNotification(device, message_bull, payload);
        });

        ActivityHelper.createActivity(bull_user, user, plan, notification_type, message_calf, message_bull,
          source, received_at, function(err, activity) {
            activities.push(activity);

            callback(err, activity);
        });
      }, function(err) {
        callback(err, activities);
      });
    });
  }
}
