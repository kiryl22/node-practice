var express = require('express');
var router = express.Router();

var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  // if the user is not authenticated then redirect him to the login page
  res.redirect('/auth/login');
}

/* GET home page. */
router.get('/', isAuthenticated, function(req, res, next) {
    res.render('index');
});

module.exports = router;
