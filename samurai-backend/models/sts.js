
const mongoose = require('mongoose');

const stsSchema = new mongoose.Schema({

    ward_number: {
        type: Number,
        required: true,
        unique: true
    },
    capacity: {
        type: Number,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    assigned_managers_id: {
        type: String,
        required: true,
        unique: true
    }
});

const STS = mongoose.model('STS', stsSchema);

module.exports = STS;
