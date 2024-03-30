const mongoose = require('mongoose');

const landfillEntrySchema = new mongoose.Schema({
    landfill_id: {
        type: String,
        required: true
    },
    vehicle_registration: {
        type: String,
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
    },
    from: {
        type: Number,
        required: true
    }
});

const LandfillEntry = mongoose.model('LandfillEntry', landfillEntrySchema);

module.exports = LandfillEntry;
