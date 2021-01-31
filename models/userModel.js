const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
        default: 'images/portrait.png',
    },

    bookedAppointments: [{
        type: String
    }],

    age: {
        type: Number,
        required: true
    },

    height: {
        type: mongoose.Schema.Types.Decimal128,
        required: true
    },

    weight: {
        type: mongoose.Schema.Types.Decimal128,
        required: true
    }
});

module.exports = mongoose.model('User', userSchema);