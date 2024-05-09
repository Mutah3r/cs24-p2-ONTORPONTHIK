const mongoose = require('mongoose');

// Define schema
const vehicleSchema = new mongoose.Schema({
    registration_number: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        enum: ['Open Truck', 'Dump Truck', 'Compactor', 'Container Carrier'],
        required: true
    },
    capacity: {
        type: Number,
        enum: [3,5,7,15],
        required: true
    },
    fuel_cost_per_km_loaded: {
        type: Number,
        required: true
    },
    fuel_cost_per_km_unloaded: {
        type: Number,
        required: true
    },

    left_from_sts: {
        type : Boolean,
        default: false,
        require: false
    },

    left_from_landfill: {
        type: Boolean,
        default: true,
        require:false
    },

    destination_landfill: {
        type: String,
        required: false
    }

});

// Create model
const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;