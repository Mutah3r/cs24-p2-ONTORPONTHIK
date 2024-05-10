const mongoose = require('mongoose');

// Define the Employee schema
const employeeSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true
    },
    date_of_birth: {
        type: Date,
        required: true
    },
    date_of_hire: {
        type: Date,
        required: true
    },
    job_title: {
        type: String,
        required: true
    },
    payment_rate_per_hour: {
        type: Number,
        required: true
    },

    contact_information: { // phone number
       type: Number,
       required: true
    },

    assigned_collection_route: { // show all sts here to select
        type: Number,
        required: true
    },
    assigned_manager_id: { // the manager who shall create the employee id shall be send here
        type: String,
        required: true
    }
});


// Create the Employee model
const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
