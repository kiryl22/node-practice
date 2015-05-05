var express = require('express');
var Project = require('../models/project');
var router = express.Router();

var isAuthenticated = function (req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated())
    return next();
  // if the user is not authenticated then redirect him to the login page
  res.redirect('/auth/login');
}

/* GET home page. */
router.get('/', isAuthenticated, function(req, res, next) {
    res.render('index');
});

router.post('/CreateProject', isAuthenticated, function(req, res, next) {
  Project.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

router.get('/ProjectsList', isAuthenticated, function(req, res, next) {
  Project.find({}, function(err, projects){
    if (err) return next(err);
    res.json(projects);
  });
});

module.exports = router;
