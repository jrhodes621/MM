const Activity = require('../models/activity');

const UserActivitiesController = {
  GetActivities: (req, res, next) => {
    const user = req.user;

    Activity.aggregate([
      { $match: { calf: user._id } },
      { $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' }, day: { $dayOfMonth: '$createdAt' } },
        date_group: { $first: '$createdAt' },
        activities: { $push: '$$ROOT' },
      },
      }, { $project: {
        _id: 0,
        date_group: 1,
        activities: 1,
      },
      },
    ])
    .exec((err, activities) => {
      if (err) { return next(err); }

      return res.status(200).send(activities);
    });
  },
};

module.exports = UserActivitiesController;
