var express = require('express');
var router = express.Router();

module.exports = function(passport) {
  router.get('/login', function (req, res, next) {
    res.render('login', {title: 'Login', message: req.flash('message')});
  });

  /* Handle Login POST */
  router.post('/login', passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true
  }));

  router.get('/signup', function (req, res, next) {
    res.render('signup', {title: 'Sign Up', message: req.flash('message')});
  });

  /* Handle Registration POST */
  router.post('/signup', passport.authenticate('signup', {
    successRedirect: '/auth/login',
    failureRedirect: '/auth/signup',
    failureFlash: true
  }));

  /* Handle Logout */
  router.get('/signout', function (req, res) {
    req.logout();
    res.redirect('/');
  });

  return router;
}
