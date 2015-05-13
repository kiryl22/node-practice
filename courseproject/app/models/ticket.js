var mongoose = require('mongoose');

module.exports = mongoose.model('Ticket',{
    name: { type: String, required: true },
    projectId: {type: String, required: true},
    status: { type: String, required: false },
    priority: { type: String, required: false },
    description: { type: String, required: false },
    assigneeId: {type: String, required: false}
});