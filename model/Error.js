const mongoose = require('mongoose');

const errorSchema = mongoose.Schema({
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

module.exports = mongoose.model('Error', errorSchema);