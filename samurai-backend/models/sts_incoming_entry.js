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
    amount_of_waste_collected: {  // in ton [Wc]
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
    },
    contract_manager_id : { // from contract id , find the manager id and store it here.
        type : String,
        required : true
    },
    payment_per_tonnage_of_waste: { // from contract id , find the ThirdPartyCnt and store it [Pt]
        type: Number,
        required: true
    },
    required_amount_of_waste_per_day: { // from contract id , find the ThirdPartyCnt and store it. in tone [Wr]
        type: Number,
        required: true
    },

    basic_pay : { // Wc*Pt
        type: Number,
        required: true
    },

    fine : { // (Wr-Wc)*Pt
        type : Number,
        required : true
    },

    total_bill : { // basic_pay - fine
        type : Number,
        required: true
    }

});

// Create the STS Incoming Entry Log model
const STSIncomingEntryLog = mongoose.model('STSIncomingEntryLog', stsIncomingEntryLogSchema);

module.exports = STSIncomingEntryLog;
