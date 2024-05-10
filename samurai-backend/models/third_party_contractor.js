const mongoose = require('mongoose');

const ThirdPartyContractorSchema = new mongoose.Schema({
    name_of_the_company: {
        type: String,
        required: true
    },
    registration_id: {
        type: String,
        required: true,
        unique: true
    },
    registration_date: {
        type: Date,
        required: true
    },
    tin_of_the_company: {
        type: String,
        required: true
    },
    contact_number: {
        type: String,
        required: true
    },
    workforce_size: {
        type: Number,
        required: true
    },
    payment_per_tonnage_of_waste: {
        type: Number,
        required: true
    },
    required_amount_of_waste_per_day: {
        type: Number,
        required: true
    },
    contract_duration: {
        type: String,
        required: true
    },
    area_of_collection: {
        type: String,
        required: true
    },
    designated_sts: {
        type: number,  // ward number
        required: true
    }
});

const ThirdPartyCnt = mongoose.model('ThirdPartyCnt', ThirdPartyContractorSchema);

module.exports = ThirdPartyCnt;
