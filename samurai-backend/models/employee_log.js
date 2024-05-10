const mongoose = require('mongoose');

const employeeLogSchema = new mongoose.Schema({
    employee_id: { // select it from this particular managers contacted employes.... using managers id.
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
        required: True
    },
    total_payment: { // for contact managers , they can create a pay slip for each employee . Get employe hourly payment and mutiply it with total hour worked and then generate a pay slip from frontend with time detals and payment
        type: Number,
        required: true
    }
});

const EmployeeLog = mongoose.model('EmployeeLog', employeeLogSchema);

module.exports = EmployeeLog;
