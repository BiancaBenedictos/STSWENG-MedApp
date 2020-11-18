const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const clinicSchema =  mongoose.Schema({
    _id: mongoose.Types.ObjectId,

    clinicName: {
        type: String,
        required: true,
    },

    clinicAddress: {
        street: String,
        city: String,
        state: String,
    },

    clinicDoctors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
    }],

});

clinicSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Clinic', clinicSchema);