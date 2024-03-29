const STS = require('../models/sts');
const userModel = require('../models/user_accounts');
const jwt = require('jsonwebtoken');
const Landfill = require('../models/landfill')
const Vehicle = require('../models/vehicle');




// STS 

// GET method for retrieving STS information
exports.getSTSInformation = async (req, res) => {
    try {
        // Extract token from request headers
        const token = req.params.token;

        // Check if token exists in the database
        const user = await userModel.findOne({ token });
        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Verify if user is a system manager
        if (user.role !== 'System admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Retrieve all STS information from the database
        const stsInfo = await STS.find();

        // Fetch the name of the assigned manager for each STS
        const stsWithManager = await Promise.all(stsInfo.map(async (sts) => {
            // Find the manager by their MongoDB ID
            const manager = await userModel.findById(sts.assigned_manager_id);
            // If manager is found, assign their name to managerName, otherwise assign 'Unassigned'
            const managerName = manager ? manager.name : 'Unassigned';

            // Return an object containing STS information along with assigned manager name
            return {
                ...sts.toObject(),
                assigned_manager_name: managerName
            };
        }));

        res.status(200).json(stsWithManager);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};




// POST method for creating a new STS (System Admin access)
exports.createSTS = async (req, res) => {
    try {
        // Extract token from request headers
        // Extract STS information from request body
        const { ward_number, capacity, latitude, longitude, token } = req.body;


        // Check if token exists in the database
        const user = await userModel.findOne({ token });

        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Verify if user is a system admin
        if (user.role !== 'System admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }


        // Create a new STS instance
        const newSTS = new STS({
            ward_number,
            capacity,
            latitude,
            longitude,
            assigned_managers_id: "-1"// Initial value for assigned manager ID
        });

        // Save the new STS instance to the database
        await newSTS.save();

        res.status(200).json({ message: 'STS created successfully', sts: newSTS });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};





// Landfill


// GET method for retrieving Landfill information
exports.getLandfillInformation = async (req, res) => {
    try {
        // Extract token from request headers
        const token = req.params.token;

        // Check if token exists in the database
        const user = await userModel.findOne({ token });
        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Verify if user is a system manager
        if (user.role !== 'System admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Retrieve all Landfill information from the database
        const landfillInfo = await Landfill.find();

        // Fetch the name of the assigned manager for each Landfill
        const landfillsWithManager = await Promise.all(landfillInfo.map(async (landfill) => {
            // Find the manager by their MongoDB ID
            const manager = await userModel.findById(landfill.assigned_manager_id);
            // If manager is found, assign their name to managerName, otherwise assign 'Unassigned'
            const managerName = manager ? manager.name : 'Unassigned';

            // Return an object containing Landfill information along with assigned manager name
            return {
                ...landfill.toObject(),
                assigned_manager_name: managerName
            };
        }));

        res.status(200).json(landfillsWithManager);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// POST method for creating a new Landfill (System Admin access)
exports.createLandfill = async (req, res) => {
    try {
        // Extract token from request headers
        // Extract Landfill information from request body
        const { name, capacity, latitude, longitude, token } = req.body;

        // Check if token exists in the database
        const user = await userModel.findOne({ token });

        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Verify if user is a system admin
        if (user.role !== 'System admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Create a new Landfill instance
        const newLandfill = new Landfill({
            name,
            capacity,
            latitude,
            longitude,
            assigned_managers_id: "-1"// Initial value for assigned manager ID
        });

        // Save the new Landfill instance to the database
        await newLandfill.save();

        res.status(200).json({ message: 'Landfill created successfully', landfill: newLandfill });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};







// STS Manager assignement




// POST method for assigning a manager to an STS (System Admin access)
exports.assignManagerToSTS = async (req, res) => {
    try {
        // Extract user_id, token, and sts_id from request body
        const { user_id, token, sts_id } = req.body;

        // Check if token exists in the database
        const user = await userModel.findOne({ token });
        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Verify if user is a system manager
        if (user.role !== 'System admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Check if the provided user_id is an STS manager
        const assignedManager = await userModel.findById(user_id);
        if (!assignedManager || assignedManager.role !== 'STS manager') {
            return res.status(400).json({ message: 'Invalid STS manager ID' });
        }

        // Assign the manager to the specified STS
        const sts = await STS.findById(sts_id);
        if (!sts) {
            return res.status(404).json({ message: 'STS not found' });
        }

        sts.assigned_managers_id = user_id;
        await sts.save();

        res.status(200).json({ message: 'Manager assigned to STS successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};










// Landfill manager assignement



// POST method for assigning a manager to a landfill (System Admin access)
exports.assignManagerToLandfill = async (req, res) => {
    try {
        // Extract user_id, token, and landfill_id from request body
        const { user_id, token, landfill_id } = req.body;

        // Check if token exists in the database
        const user = await userModel.findOne({ token });
        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Verify if user is a system manager
        if (user.role !== 'System admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Check if the provided user_id is a Landfill manager
        const assignedManager = await userModel.findById(user_id);
        if (!assignedManager || assignedManager.role !== 'Landfill manager') {
            return res.status(400).json({ message: 'Invalid Landfill manager ID' });
        }

        // Assign the manager to the specified landfill
        const landfill = await Landfill.findById(landfill_id);
        if (!landfill) {
            return res.status(404).json({ message: 'Landfill not found' });
        }

        landfill.assigned_managers_id = user_id;
        await landfill.save();

        res.status(200).json({ message: 'Manager assigned to Landfill successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};








// POST method for adding a new vehicle
exports.addVehicle = async (req, res) => {
    try {
        // Extract vehicle information from request body
        const { token, registration_number, type, capacity, fuel_cost_per_km_loaded, fuel_cost_per_km_unloaded } = req.body;


        const user = await userModel.findOne({ token });
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Verify if user is a system manager
        if (user.role !== 'System admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }



        // Create a new vehicle instance
        const newVehicle = new Vehicle({
            registration_number,
            type,
            capacity,
            fuel_cost_per_km_loaded,
            fuel_cost_per_km_unloaded
        });

        // Save the new vehicle instance to the database
        await newVehicle.save();

        res.status(200).json({ message: 'Vehicle added successfully', vehicle: newVehicle });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
