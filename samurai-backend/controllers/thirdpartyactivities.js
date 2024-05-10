const STS = require('../models/sts');
const userModel = require('../models/user_accounts');
const jwt = require('jsonwebtoken');
const Landfill = require('../models/landfill')
const Vehicle = require('../models/vehicle');
const STSEntry = require('../models/sts_entry')
const LandfillEntry = require('../models/landfill_entry')
const ThirdPartyCnt = require('../models/third_party_contractor'); 

exports.getAllThirdPartyContractors = async (req, res) => { // contactor companies
    try {
        const contractors = await ThirdPartyCnt.find({});
        res.status(200).send(contractors);
    } catch (error) {
        console.error('Failed to retrieve contractors:', error);
        res.status(500).send({
            message: "Failed to retrieve data due to server error",
            error: error.message
        });
    }
};



exports.addThirdPartyContractor = async (req, res) => {
        try {
            // Create a new contractor from the request body
            const newContractor = new ThirdPartyCnt({
                name_of_the_company: req.body.name_of_the_company,
                registration_id: req.body.registration_id,
                registration_date: req.body.registration_date,
                tin_of_the_company: req.body.tin_of_the_company,
                contact_number: req.body.contact_number,
                workforce_size: req.body.workforce_size,
                payment_per_tonnage_of_waste: req.body.payment_per_tonnage_of_waste,
                required_amount_of_waste_per_day: req.body.required_amount_of_waste_per_day,
                contract_duration: req.body.contract_duration,
                area_of_collection: req.body.area_of_collection, // Input a random name
                designated_sts: req.body.designated_sts, // SET it from sts drop down box
                assigned_manager_id: "-1",
                total_waste_stored: 0
            });
    
            // Save the new contractor to the database
            await newContractor.save();
    
            // Send a response back to the client
            res.status(201).send({
                message: "New third-party contractor added successfully",
                contractor: newContractor
            });
        } catch (error) {
            console.error('Error adding new contractor:', error);
            res.status(500).send({
                message: "Failed to add new contractor due to server error",
                error: error.message
            });
        }
};
    