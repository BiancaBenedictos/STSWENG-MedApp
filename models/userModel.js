const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    usertype: {
        type: String,
        enum: ['patient', 'admin'],
        required: true
    },

    email: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true,
    },

    firstname: {
        type: String,
        required: true,
    },

    lastname: {
        type: String,
        required: true,
    },

    profpic: {
        type: String,
        default: 'portrait.png',
    },

    bookedAppointments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointments'}],

});

// patientSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Patient', patientSchema);