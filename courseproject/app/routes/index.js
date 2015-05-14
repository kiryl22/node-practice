var express = require('express');
var Project = require('../models/project');
var Ticket = require('../models/ticket');
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

router.post('/SaveProject', isAuthenticated, function(req, res, next) {
  var project = req.body;
  if(project._id)
  {
    Project.findByIdAndUpdate(project._id, project, function (err, data) {
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
  Ticket.findOne({'_id' : req.query.ticketId}, function(err, project){
    if (err) return next(err);
    res.json(project);
  });
});

router.post('/SaveTicket', isAuthenticated, function(req, res, next) {
  var ticket = req.body;
  if(ticket._id)
  {
    Ticket.findByIdAndUpdate(ticket._id, ticket, function (err, data) {
      if (err) return handleError(err);
      res.json(data);
    });
  }else {
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

module.exports = router;
