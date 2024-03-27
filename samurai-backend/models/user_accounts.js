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
    }
});

// Create model
const User = mongoose.model('User', userSchema);

module.exports = User;