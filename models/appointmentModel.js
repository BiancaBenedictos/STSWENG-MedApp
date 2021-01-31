const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    bookedDoctor: {
        type: String
    },

    doctorName: {
        type: String
    },

    doctorPic: {
        type: String
    },

    patient: {
        type: String
    },

    patientName: {
        type: String
    },

    patientPic: {
        type: String
    },

    clinic: {
        type: String
    },

    clinicName: {
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