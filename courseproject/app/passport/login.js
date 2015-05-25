var LocalStrategy   = require('passport-local').Strategy;
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){

    passport.use('login', new LocalStrategy({
                passReqToCallback : true,
                usernameField: 'email',
                passwordField: 'password'
            },
            function(req, email, password, done) {
                // check in mongo if a user with username exists or not
                User.findOne({ 'email' :  email },
                    function(err, user) {
                        // In case of any error, return using the done method
                        if (err)
                            return done(err);
                        // Username does not exist, log the error and redirect back
                        if (!user){
                            console.log('User Not Found with email '+ email);
                            return done(null, false, req.flash('message', 'Invalid email or password'));
                        }
                        // User exists but wrong password, log the error
                        if (!isValidPassword(user, password)){
                            console.log('Invalid Password');
                            return done(null, false, req.flash('message', 'Invalid email or password'));
                        }
                        // User and password both match, return user from done method
                        // which will be treated like success
                        return done(null, user);
                    }
                );

            })
    );

    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    }
}