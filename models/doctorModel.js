const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const doctorSchema = mongoose.Schema({
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

    Clinic: {
        type: mongoose.Types.ObjectId,
        ref: 'Clinic'
    },

    profession: {
        type: String,
        enum: ['Pediatrician', 'Gynecologist', 'Obstetrician', 'Surgeon', 'Psychiatrist', 'Cardiologist', 'Dermatologist', 'Endocrinologist',
               'Ophtalmologist', 'Pulmonologist', 'Gastroenterologist', 'Nephrologist', 'Otolaryngologist', 'Neurologist', 'Radiologist',
               'Anesthesiologist', 'Oncologist'],
        required: true,
    },

    credentials: [{
        type: String,
        required: true,
    }],

    profpic: {
        type: String,
        default: 'portrait.png',
    },

});

doctorSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Doctor', doctorSchema);