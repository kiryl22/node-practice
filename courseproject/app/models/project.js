var mongoose = require('mongoose');

module.exports = mongoose.model('Project',{
    name: { type: String, required: true },
    statuses: { type: [], required: false },
    priorities: { type: [], required: false },
    description: { type: String, required: false },
    created: { type: Date, default: Date.now }
});