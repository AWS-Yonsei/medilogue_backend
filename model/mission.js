const mongoose = require('mongoose');

const missionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'cancelled'],
        default: 'active'
    },
    patient: {
        uid: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        }
    },
    doctor: {
        uid: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        specialization: {
            type: String,
            required: true
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Mission = mongoose.model('Mission', missionSchema);

module.exports = Mission;
