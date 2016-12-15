var express    = require('express');        // call express
var router = express.Router();              // get an instance of the express Router
var mongoose   = require('mongoose');
var Activity   = require('../../models/activity.js');

// on routes that end in /me
// ----------------------------------------------------
router.route('')
  .get(function(req, res) {
    var current_user = req.current_user;

    Activity.find({ "bull": current_user})
    .populate('bull')
    .populate('calf')
    .populate('plan')
    .exec(function(err, activities) {
      if(err) { return next(err) }

      res.status(200).send(activities);
    })
  });

module.exports = router;
