const mongoose = require('mongoose');

const clinicSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    doctors: [{
        name: {
            type: String,
            required: true
        },
        specialization: {
            type: String,
            required: true
        }
    }],
    patients: [{
        name: {
            type: String,
            required: true
        },
        age: {
            type: Number,
            required: true
        },
        gender: {
            type: String,
            enum: ['Male', 'Female'],
            required: true
        }
    }]
});

const Clinic = mongoose.model('Clinic', clinicSchema);

module.exports = Clinic;
