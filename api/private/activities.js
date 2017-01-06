var express    = require('express');        // call express
var router = express.Router();              // get an instance of the express Router
var mongoose   = require('mongoose');
var Activity   = require('../../models/activity.js');

// on routes that end in /me
// ----------------------------------------------------
router.route('')
  .get(function(req, res, next) {
    var current_user = req.current_user;

    Activity.aggregate([
      { $match: { bull: current_user._id } },
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
    })
  });

module.exports = router;
