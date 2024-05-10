const mongoose = require('mongoose');

// Define the STS Incoming Entry Log schema
const stsIncomingEntryLogSchema = new mongoose.Schema({
    contractor_id: {    // company ID
        type: String,
        required: true
    },    
    time_and_date_of_collection: {
        type: Date,
        required: true,
        default: Date.now
    },
    amount_of_waste_collected: { 
        type: Number,
        required: true,
    },
    type_of_waste_collected: {
        type: String,
        required: true,
        enum: ['Domestic', 'Plastic', 'Construction Waste'], //just from drop down box
    },
    designated_sts_for_deposit: {
        type: Number,
        required: true
    },
    vehicle_used_for_transportation: { // this is from doorstep to sts, so enter by name, like rikshaw, or thela gari
        type: String,
        required: true
    }
});

// Create the STS Incoming Entry Log model
const STSIncomingEntryLog = mongoose.model('STSIncomingEntryLog', stsIncomingEntryLogSchema);

module.exports = STSIncomingEntryLog;
