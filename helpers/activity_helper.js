var Activity = require('../models/activity');

module.exports = {
  createActivity(bull, calf, plan, activity_type, message_calf, message_bull, source, received_at, callback) {
    var activity = new Activity()

    activity.bull = bull;
    activity.calf = calf;
    activity.plan = plan;
    activity.type = activity_type;
    activity.message_calf = message_calf;
    activity.message_bull= message_bull;
    activity.received_at = received_at;
    activity.source = source

    activity.save(function(err) {
      callback(err, activity);
    });
  }
}
