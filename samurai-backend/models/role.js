const mongoose = require('mongoose');



const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    permissions: {
        DashboardStatistics: {
            type: Boolean,
            default: false
        },
        AddVehicle: {
            type: Boolean,
            default: false
        },

        AddVehicleEntry: {
            type: Boolean,
            default: false
        },
        billing: {
            type: Boolean,
            default: false
        }
        
    }
});


const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
