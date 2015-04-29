var LocalStrategy   = require('passport-local').Strategy;
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){

    passport.use('signup', new LocalStrategy({
                passReqToCallback : true, // allows us to pass back the entire request to the callback
                usernameField: 'email',
                passwordField: 'password'
            },
            function(req, email, password, done) {

                    // find a user in Mongo with provided username
                    User.findOne({ 'email' :  email }, function(err, user) {
                        // In case of any error, return using the done method
                        if (err){
                            console.log('Error in SignUp: '+ err);
                            return done(err);
                        }
                        // already exists
                        if (user) {
                            console.log('User already exists with email: '+ email);
                            return done(null, false, req.flash('message','User Already Exists'));
                        } else {
                            // if there is no user with that email
                            // create the user
                            var newUser = new User();

                            // set the user's local credentials
                            newUser.password = createHash(password);
                            newUser.email = email;
                            newUser.firstName = req.param('firstName');
                            newUser.lastName = req.param('lastName');

                            // save the user
                            newUser.save(function(err) {
                                if (err){
                                    console.log('Error in Saving user: '+ err);
                                    throw err;
                                }
                                console.log('User Registration succesful');
                                return done(null, newUser);
                            });
                        }
                    });
            })
    );

    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

}