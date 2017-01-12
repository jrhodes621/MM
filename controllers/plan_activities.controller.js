var Plan = require('../models/plan');
var Activity = require('../models/activity');

var PlanActivitiesController = {
  GetActivities: function(req, res, next) {
    var current_user = req.current_user;
    var plan = req.plan;

    Activity.aggregate([
      { $match: { "plan": plan._id } },
      { $group: {
           _id: { year: { $year : "$createdAt" }, month: { $month : "$createdAt" },day: { $dayOfMonth : "$createdAt" } },
           date_group: { $first : '$createdAt' },
          activities: { $push: '$$ROOT'}
      } },
      { $project: {
          _id: 0,
          date_group: 1,
          activities: 1
        }
      }
    ])
    // .populate('bull')
    // .populate('calf')
    // .populate('plan')
    .exec(function(err, activities) {
      if(err) { return next(err) }

      res.status(200).send(activities);
    });
  }
}

module.exports = PlanActivitiesController
