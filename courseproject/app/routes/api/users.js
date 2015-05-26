var express = require('express');
var User = require('../../models/user');
var router = express.Router();

var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/auth/login');
}

router.post('/', isAuthenticated, function(req, res, next) {
  User.find({}, function(err, users){
    if (err) return next(err);
    var result = users.map(mapUser);
    res.json(result);
  });
});

var mapUser =  function(userModel){
  return {
    email: userModel.email,
    firstName: userModel.firstName,
    lastName: userModel.lastName,
    _id: userModel._id
  }
}

module.exports = router;
