const ActivityServices = {
  GetActivities: function(params, callback) {
    this.paginate(params.query, params.paging, callback);
  },
  GetActivity: function(params, callback) {
    this.findById(params.activity_id, callback);
  },
  SaveActivity: (activity, callback) => {
    activity.save(callback);
  },
  CreateActivity: function(bull, calf, plan, activityType, messageCalf, messageBull, source, receivedAt,
    callback) {
    const activity = new this();

    activity.bull = bull;
    activity.calf = calf;
    activity.plan = plan;
    activity.type = activityType;
    activity.message_calf = messageCalf;
    activity.message_bull = messageBull;
    activity.received_at = receivedAt;
    activity.source = source;

    activity.save((err) => {
      callback(err, activity);
    });
  },
};

module.exports = ActivityServices;
