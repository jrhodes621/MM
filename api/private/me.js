var express    = require('express');        // call express
var router = express.Router();              // get an instance of the express Router
var mongoose   = require('mongoose');

// on routes that end in /me
// ----------------------------------------------------
router.route('')
  .get(function(req, res) {
    res.json(req.current_user);
  });

module.exports = router;
