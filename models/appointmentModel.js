const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const appointmentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

    bookedDoctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
    },

    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient'
    },

    bookedDate: {
        type: Date,
        default: Date(-8640000000000000),
        required: true
    },

    bookDetails: {
        type: String,
    },

    Status: {
        type: String,
        enum: ['Accepted', 'Declined', 'Completed'],
        required: true,
    },

});

appointmentSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Appointment', appointmentSchema);