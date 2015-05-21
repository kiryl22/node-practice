var express = require('express');
var Project = require('../models/project');
var Ticket = require('../models/ticket');
var User = require('../models/user');
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

/* db calls */
router.post('/SaveProject', isAuthenticated, function(req, res, next) {
  var project = req.body;
  if(project._id)
  {
    Project.findByIdAndUpdate(project._id, project, {'new': true}, function (err, data) {
      if (err) return handleError(err);
      res.json(data);
    });
  }else {
    Project.create(project, function (err, data) {
      if (err) return next(err);
      res.json(data);
    });
  }
});

router.get('/ProjectsList', isAuthenticated, function(req, res, next) {
  Project.find({}, function(err, projects){
    if (err) return next(err);
    res.json(projects);
  });
});

router.get('/GetProject', isAuthenticated, function(req, res, next) {
  Project.findOne({'_id' : req.query.projectId}, function(err, project){
    if (err) return next(err);
    res.json(project);
  });
});

router.get('/GetTicket', isAuthenticated, function(req, res, next) {
  Ticket.findOne({'_id' : req.query.ticketId}, function(err, ticket){
    if (err) return next(err);
    res.json(ticket);
  });
});

router.post('/SaveTicket', isAuthenticated, function(req, res, next) {
  var ticket = req.body;
  if(ticket._id)
  {
    Ticket.findByIdAndUpdate(ticket._id, ticket, {'new': true}, function (err, data) {
      if (err) return handleError(err);
      res.json(data);
    });
  } else {
    ticket.author = mapUser(req.user);
    Ticket.create(ticket, function (err, data) {
      if (err) return next(err);
      res.json(data);
    });
  }
});

router.get('/GetTickets', isAuthenticated, function(req, res, next) {
  Ticket.find({'projectId': req.query.projectId}, function(err, tickets){
    if (err) return next(err);
    res.json(tickets);
  });
});

router.post('/UsersList', isAuthenticated, function(req, res, next) {
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
