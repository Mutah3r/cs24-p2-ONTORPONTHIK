const mongoose = require('mongoose');

const billingSlipSchema = new mongoose.Schema({
    landfill_entry_id: {
        type: Number,
        required: true
    },
    timestamps: {
        arrival: {
            type: Date,
            required: true
        },
        departure: {
            type: Date,
            required: true
        }
    },
    weight_of_waste: {
        type: Number,
        required: true
    },
    vehicle_id: {
        type: String,
        required: true
    },
    fuel_allocation_stamp: {
        type: Number,
        required: true
    }
});

const BillingSlip = mongoose.model('BillingSlip', billingSlipSchema);

module.exports = BillingSlip;
