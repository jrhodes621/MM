var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/sign_in', function(req, res, next) {
  res.render('users/index');
});
router.get('/sign_up', function(req, res, next) {
  res.render('users/index');
});


module.exports = router;
