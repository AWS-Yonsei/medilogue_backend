const mongoose = require('mongoose');

const clinicSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: Array,
        required: true
    },
    doctor: {
        name: {
            type: String,
            required: true
        },
        specialization: {
            type: String,
            required: true
        }
    },
    patient: {
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
    },
    date: {
        type: Date
    }
});

const Clinic = mongoose.model('Clinic', clinicSchema);

module.exports = Clinic;
