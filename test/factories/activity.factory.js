var factory     = require('factory-girl');
var Activity    = require('../../models/activity');

factory.define('activity', Activity, function(buildOptions) {
  var activity = {
    bull: buildOptions.bull._id,
    status: "active"
  }
  if(buildOptions.calf) {
    activity.calf = buildOptions.calf._id;
  }
  if(buildOptions.plan) {
    activity.plan = buildOptions.plan._id;
  }
  activity.type = "Activity Type A";
  activity.message_calf = buildOptions.message_calf;
  activity.message_bull = buildOptions.message_bull;
  activity.received_at = new Date();
  activity.source = "MemberMoose";

  return activity;
});
