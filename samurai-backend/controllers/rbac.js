const Role = require('../models/role'); // Assuming your role model file is named 'roleModel.js'
const jwt = require("jsonwebtoken")
const userModel = require('../models/user_accounts')

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
        const { name,token } = req.body;
        const user = await userModel.findOne({ token });

        if (!user) {
          return res.status(401).json({ message: "Invalid token" });
        }

        jwt.verify(token, process.env.jwt_secret_key, async (err, decoded) => {
          if (err) {
            return res.status(401).json({ message: "Invalid token" });
          }
    
          // Check if the user's role is system admin
          if (user.role !== "System admin") {
            return res.status(403).json({ message: "Unauthorized" });
          }
        const roles = await Role.findOne({ name });
        if(roles){
          return res.status(403).json({ message: "Allready added" });
        }
          // Create a new role instance
        const role = new Role({ name });

        // Save the role to the database
        await role.save();

        // Respond with a success message
        res.status(201).json({ message: 'Role created successfully', role });
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    };
    
    // GET method for listing all available roles
    exports.getAllRoles = async (req, res) => {
      try {
        const roles = await Role.find();
        res.status(200).json(roles);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    };
    
    // PUT method for updating a user's roles (System Admin access)
    exports.updateUserRoles = async (req, res) => {
      const userId = req.params.userId;
      const { roles, token } = req.body;
    
      try {
        // Check if the token exists in user_account
        const user = await userModel.findOne({ token });
    
        if (!user) {
          return res.status(401).json({ message: "Invalid token" });
        }
    
        // Verify the token
        jwt.verify(token, process.env.jwt_secret_key, async (err, decoded) => {
          if (err) {
            return res.status(401).json({ message: "Invalid token" });
          }
    
          // Check if the user's role is system admin
          if (user.role !== "System admin") {
            return res.status(403).json({ message: "Unauthorized" });
          }
    
          // Proceed with updating user roles
          let userToUpdate = await userModel.findById(userId);
          if (!userToUpdate) {
            return res.status(404).json({ message: "User not found" });
          }
    
          // Update user roles
          userToUpdate.role = roles;
          await userToUpdate.save();
    
          res.status(200).json({ message: "User roles updated successfully" });
        });
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: error.message });
    }
};

exports.updatePermissions = async (req, res) => {
  const { name, permissions, token } = req.body;

  try {
    // Check if the token exists in user_account
    const user = await userModel.findOne({ token });

    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Verify the token
    jwt.verify(token, process.env.jwt_secret_key, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      }

      // Check if the user's role is system admin
      if (user.role !== "System admin") {
        return res.status(403).json({ message: "Unauthorized" });
      }

      // Find the role by name
      const role = await Role.findOne({ name });

      if (!role) {
        return res.status(404).json({ message: "Role not found" });
      }

      // Update permissions
      role.permissions = permissions;

      await role.save();

      res.status(200).json({ message: "Permissions updated successfully" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};