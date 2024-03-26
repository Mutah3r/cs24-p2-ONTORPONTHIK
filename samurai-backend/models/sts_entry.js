const mongoose = require('mongoose');

const stsEntrySchema = new mongoose.Schema({
    sts_id: {
        type: String,
        required: true
    },
    vehicle_id: {
        type: Number,
        required: true
    },
    weight_of_waste: {
        type: Number,
        required: true
    },
    time_of_arrival: {
        type: Date,
        required: true
    },
    time_of_departure: {
        type: Date,
        required: true
    }
});

const STSEntry = mongoose.model('STSEntry', stsEntrySchema);

module.exports = STSEntry;
