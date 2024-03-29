const STS = require('../models/sts');
const userModel = require('../models/user_accounts');
const jwt = require('jsonwebtoken');



// GET method for retrieving STS information
exports.getSTSInformation = async (req, res) => {
    try {
        // Extract token from request headers
        const token = req.params.token;

        // Check if token exists in the database
        const user = await userModel.findOne({ token });
        console.log(user.role);
        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Verify if user is a system manager
        if (user.role !== 'System admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Retrieve STS information from the database
        const stsInfo = await STS.find();

        // Fetch the name of assigned managers for each STS
        const stsWithManagers = await Promise.all(stsInfo.map(async (sts) => {
            const managerNames = await Promise.all(sts.assigned_managers_id.map(async (managerId) => {
                const manager = await userModel.findById(managerId);
                return manager ? manager.name : 'Unassigned';
            }));
            return {
                ...sts.toObject(),
                assigned_managers_names: managerNames
            };
        }));

        res.status(200).json(stsWithManagers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};





// POST method for creating a new STS (System Admin access)
exports.createSTS = async (req, res) => {
    try {
        // Extract token from request headers
        
        const token = req.params.token;


        // Check if token exists in the database
        const user = await userModel.findOne({ token });

        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Verify if user is a system admin
        if (user.role !== 'System Admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Extract STS information from request body
        const { ward_number, capacity, latitude, longitude } = req.body;

        // Create a new STS instance
        const newSTS = new STS({
            ward_number,
            capacity,
            latitude,
            longitude,
            assigned_managers_id: -1 // Initial value for assigned manager ID
        });

        // Save the new STS instance to the database
        await newSTS.save();

        res.status(200).json({ message: 'STS created successfully', sts: newSTS });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
