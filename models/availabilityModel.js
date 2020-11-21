const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
    day: {
        type: String,
        enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        required: true
    },

    startTime: {
        type: Date,
        required: true
    },

    endTime: {
        type: Date,
        required: true
    },

    interval: {
        type: Number,
        required: true
    },

    doctorID: {
        type: String,
        required: true
    },

    clinicID: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Availability', availabilitySchema);