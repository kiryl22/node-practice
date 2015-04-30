var mongoose = require('mongoose');

module.exports = mongoose.model('User',{
    password: { type: String, required: true },
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true }
});