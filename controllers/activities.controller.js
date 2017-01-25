const Activity = require('../models/activity');

const ActivitiesController = {
  GetActivities: (req, res, next) => {
    const currentUser = req.currentUser;

    Activity.aggregate([
      { $match: { bull: currentUser.account._id } },
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
    // .populate('bull')
    // .populate('calf')
    // .populate('plan')
    .exec((err, activities) => {
      if (err) { return next(err); }

      return res.status(200).send(activities);
    });
  },
};

module.exports = ActivitiesController;
