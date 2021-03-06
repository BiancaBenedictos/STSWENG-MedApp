const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
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
    }
});

module.exports = mongoose.model('Admin', adminSchema);