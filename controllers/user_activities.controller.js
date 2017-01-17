var Activity = require('../models/activity');
var User = require('../models/user');

var UserActivitiesController = {
  GetActivities: function(req, res, next) {
    console.log("getting activities");

    var current_user = req.current_user;
    var user = req.user;

    Activity.aggregate([
      { $match: { "calf": user._id } },
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
    .exec(function(err, activities) {
      if(err) { return next(err) }

      res.status(200).send(activities);
    })
  }
}

module.exports = UserActivitiesController
