var async                        = require('async');
var PushNotificationServices     = require('../services/push_notification.services');
var Activity                     = require('../models/activity');
var User                         = require('../models/user');

module.exports = {
  notifyUsers: function(notification_type, bull, calf, plan, message_bull, message_calf, source, received_at, callback) {
    var payload = {'messageFrom': 'MemberMoose',
                  'type': "customer_created"};

    var activities = [];
    User.find({ "account": bull }, function(err, users) {
      async.eachSeries(users, function(user, callback) {
        var devices = user.devices;
        devices.forEach(function(device) {
          PushNotificationServices.SendPushNotification(device, message_bull, payload);
        });

        Activity.CreateActivity(bull, calf, plan, notification_type, message_calf, message_bull,
          source, received_at, function(err, activity) {
            activities.push(activity);

            callback(err, activity);
        });
      }, (err) => {
        callback(err, activities);
      });
    });
  }
}
