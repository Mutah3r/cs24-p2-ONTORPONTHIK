const mongoose = require('mongoose');

const employeeLogSchema = new mongoose.Schema({
    employee_id: {   
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    log_in_time: {
        type: Date,
        required: true
    },
    log_out_time: {
        type: Date,
        required: true
    },
    total_hours_worked : {
        type: Number,
        required: true
    },
    waste_carried : { // get it in kg , then convert it to TON by dividing 1000
        type: Number,
        required: true
    },
    total_payment: { // calculate current days payment by 
        type: Number,
        required: true
    }
});


const EmployeeLog = mongoose.model('EmployeeLog', employeeLogSchema);

module.exports = EmployeeLog;
