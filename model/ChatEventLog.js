const mongoose = require('mongoose');

const chatEventLogSchema = mongoose.Schema({
    leadID: {
        type: String,
        required: true
    },
    department: {
        type: String,
    },
    capturedUrl: {
        type: String,
    },
    events: [
        {
            type: {
                type: String,
                required: true
            },
            message: {
                type: String,
                required: true
            }
        }
    ]
}, {
    timestamps: true
})

module.exports = mongoose.model('ChatEventLog', chatEventLogSchema);