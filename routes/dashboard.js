var express = require('express');
var router = express.Router();

router.get('/account', function(req, res, next) {
  res.render('dashboard/index');
});
router.get('/launch', function(req, res, next) {
  res.render('dashboard/index');
});
router.get('/members', function(req, res, next) {
  res.render('dashboard/index');
});
router.get('/members/:member_id', function(req, res, next) {
  res.render('dashboard/index');
});
router.get('/plans', function(req, res, next) {
  res.render('dashboard/index');
});
router.get('/plans/:plan_id', function(req, res, next) {
  res.render('dashboard/index');
});
router.get('/plans/new', function(req, res, next) {
  res.render('dashboard/index');
});

module.exports = router;
