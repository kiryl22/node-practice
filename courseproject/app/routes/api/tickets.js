var express = require('express');
var Ticket = require('../../models/ticket');
var router = express.Router();

var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/auth/login');
}

router.get('/get', isAuthenticated, function(req, res, next) {
  Ticket.findOne({'_id' : req.query.ticketId}, function(err, ticket){
    if (err) return next(err);
    res.json(ticket);
  });
});

router.post('/save', isAuthenticated, function(req, res, next) {
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

router.get('/', isAuthenticated, function(req, res, next) {
  Ticket.find({'projectId': req.query.projectId}, function(err, tickets){
    if (err) return next(err);
    res.json(tickets);
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
