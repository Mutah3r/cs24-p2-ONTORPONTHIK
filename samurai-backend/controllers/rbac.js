const Role = require('../models/role'); // Assuming your role model file is named 'roleModel.js'

exports.getAllRoles = async (req, res) => {
  try {
    // Query all role documents
    const roles = await Role.find({}, 'name');

    // Extract role names
    const roleNames = roles.map(role => role.name);

    // Return role names
    res.status(200).json({ roles: roleNames });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.postRoles = async (req, res) => {
    try {
        // Extract the role name from the request body
        const { name } = req.body;

        // Create a new role instance
        const role = new Role({ name });

        // Save the role to the database
        await role.save();

        // Respond with a success message
        res.status(201).json({ message: 'Role created successfully', role });
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: error.message });
    }
};