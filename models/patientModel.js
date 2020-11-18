const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const patientSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

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

    age: {
        type: Number,
        required: true,
    },

    weight: {
        type: Number,
        required: true,
    },

    height: {
        type: Number,
        required: true,
    },

    profpic: {
        type: String,
        default: 'portrait.png',
    },

    bookedAppointments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Appointment'}],

});

patientSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Patient', patientSchema);