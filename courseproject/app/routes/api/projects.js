var express = require('express');
var Project = require('../../models/project');
var router = express.Router();

var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/auth/login');
}

var ifProjExists = function (req, res, next) {
  var project = req.body;
  Project.findOne({ 'name' :  project.name }, function(err, proj) {
    if (err) return next(err);
    if (!proj || !(proj._id != project._id))
      return next();

    console.log('Project already exists with name: ' + proj.name);
    res.json({error: true, message: 'Project already exists with name: ' + proj.name});
  });
}

router.post('/save', isAuthenticated, ifProjExists, function(req, res, next) {
  var project = req.body;
  if(project._id) {
    Project.findByIdAndUpdate(project._id, project, {'new': true}, function (err, data) {
      if (err) return next(err);
        res.json(data);
      });
  } else {
      Project.create(project, function (err, data) {
        if (err) return next(err);
        res.json(data);
      });
  }
});

router.get('/', isAuthenticated, function(req, res, next) {
  Project.find({}, function(err, projects){
    if (err) return next(err);
    res.json(projects);
  });
});

router.get('/get', isAuthenticated, function(req, res, next) {
  Project.findOne({'_id' : req.query.projectId}, function(err, project){
    if (err) return next(err);
    res.json(project);
  });
});

module.exports = router;
