var express = require('express');
var router = express.Router();

router.get('/partials/users/:name', function (req, res)
 {
   console.log('getting partial');
   var name = req.params.name;
   res.render('partials/users/' + name);
});
router.get('/partials/:name', function (req, res)
 {
   var name = req.params.name;
   res.render('partials/' + name);
});

module.exports = router;
