const mongoose = require('mongoose');

const chatEventLogSchema = mongoose.Schema({
    type: {
        type: String,
        require: true
    },
    message: {
        type: String,
        require: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('ChatEventLog', chatEventLogSchema);