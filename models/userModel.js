const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    usertype: {
        type: String,
        enum: ['Patient', 'Admin'],
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

    bookedAppointments: [{
        type: String
    }]
});

// patientSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('User', userSchema);