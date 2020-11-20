const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    bookedDoctor: {
        type: String
    },

    patient: {
        type: String
    },

    bookedDate: {
        type: Date,
        default: Date(-8640000000000000),
        required: true
    },

    bookDetails: {
        type: String,
    },

    status: {
        type: String,
        enum: ['Upcoming', 'Pending', 'Completed', 'Cancelled'],
        required: true,
    }
});

// appointmentSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Appointment', appointmentSchema);