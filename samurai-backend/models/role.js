const mongoose = require('mongoose');


const roleSchema = new mongoose.Schema({
    role_id:{
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    }
});


const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
