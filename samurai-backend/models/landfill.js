const mongoose = require('mongoose');

const landfillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    capacity: {
        type: Number,
        required: true
    },
    operational_timespan : {
        type : String,
        required : true
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
        required: true
    }
});

const Landfill = mongoose.model('Landfill', landfillSchema);

module.exports = Landfill;
