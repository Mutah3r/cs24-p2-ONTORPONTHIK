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
