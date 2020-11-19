const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
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

    clinic: [{
        type: String,
        required: true,
    }],

    profession: {
        type: String,
        enum: ['Pediatrician', 'Gynecologist', 'Obstetrician', 'Surgeon', 'Psychiatrist', 'Cardiologist', 'Dermatologist', 'Endocrinologist',
               'Ophtalmologist', 'Pulmonologist', 'Gastroenterologist', 'Nephrologist', 'Otolaryngologist', 'Neurologist', 'Radiologist',
               'Anesthesiologist', 'Oncologist'],
        required: true
    },

    credentials: [{
        type: String,
        required: true,
    }],

    profpic: {
        type: String,
        default: 'portrait.png',
    }
});

// doctorSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Doctor', doctorSchema);