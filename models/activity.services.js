var ActivityServices = {
  GetActivities: function(params, callback) {
    this.paginate(params.query, params.paging, callback);
  },
  GetActivity: function(params, callback) {
    this.findById(params.activity_id, callback);
  },
  SaveActivity: function(activity, callback) {
    activity.save(function(err) {
      if(err) { console.log(err); }

      callback(err);
    });
  },
  CreateActivity: function(bull, calf, plan, activity_type, message_calf, message_bull, source, received_at, callback) {
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

module.exports = ActivityServices
