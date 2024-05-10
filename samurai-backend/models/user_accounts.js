const mongoose = require('mongoose');

// Define schema
const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'Unassigned'
    },
    isLogin: {
        type: Boolean,
        default: false
    },
    token: {
        type: String
    },
    date_of_account_creation: {
        type : Date,
        required: false
    },
    contact_number: {
        type: String,
        required: false
    },
    assigned_contractor_company: {
        type: String,  // for contract managers
        required: false
    },
    access_level : {
        type: String,
        required: false
    },
    username: {
        type: String,
        required: false
    }
});

// Create model
const User = mongoose.model('User', userSchema);

module.exports = User;