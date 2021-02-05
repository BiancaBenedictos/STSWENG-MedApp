const mongoose = require('mongoose');

const clinicSchema = new mongoose.Schema({
    clinicName: {
        type: String,
        required: true,
    },

    clinicAddress: {
        street: String,
        city: String,
        state: String
    },

    clinicDoctors: [{
        type: String
    }],

    // status: {
    //     type: String,
    //     enum: ['unverified', 'verified'],
    // }
});

// clinicSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Clinic', clinicSchema);