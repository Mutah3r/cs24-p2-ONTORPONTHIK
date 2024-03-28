const userModel = require('../models/user_accounts')
const Role = require("../models/role")
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken")

exports.Registration = async (req, res) => {
    try {
        const { name, email, password, role, token } = req.body;

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

            // Check if the user role is system admin
            const userRole = user.role;
            if (userRole !== 'System admin') {
                return res.status(403).json({ message: "User is not a system admin" });
            }

            // Proceed with registration
            const hashedPassword = await bcrypt.hash(password, 10);
            const existingUser = await userModel.findOne({ email: email });

            if (existingUser) {
                return res.status(401).json({ message: "Email already exists" });
            } else {
                await userModel.create({
                    name: name,
                    email: email,
                    password: hashedPassword,
                    role: role
                });

                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: process.env.USER,
                        pass: process.env.PASS,
                    },
                });

                await transporter.sendMail({
                    from: '"EcoSync" <EcoSync@gmail.com>', // sender address
                    to: email, // list of receivers
                    subject: "Login Credential for EcoSync", // Subject line
                    text: "Login Credential for EcoSync",
                    html: `<div>
                                <p>Your Password is: ${password}</p>
                                <p>Please change your password after login.</p>
                            </div>`,
                });

                return res.status(200).json({ message: "Registration successful" });
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};







// GET method for listing all users (System Admin access)
exports.getAllUsers = async (req, res) => {
  try {
      const users = await userModel.find({}, { name: 1, email: 1, role: 1 });
      res.status(200).json(users);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};


// GET method for retrieving a specific user's details
exports.getUserById = async (req, res) => {
  const userId = req.params.userId;
  try {
      const user = await userModel.findOne({_id:userId},{ name: 1, email: 1, role: 1 });
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
  } catch (error) {
      res.status(500).json({ message: "User not found" });
  }
};

// PUT method for updating a user's details (restricted to own details or System Admin access)
exports.updateUser = async (req, res) => {
    const userId = req.params.userId;
    const { name, email, password, role, token } = req.body;
  
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
  
        // Proceed with updating user details
        let userToUpdate = await userModel.findById(userId);
        if (!userToUpdate) {
          return res.status(404).json({ message: "User not found" });
        }
  
        // Update user details
        userToUpdate.name = name;
        userToUpdate.email = email;
        
        // Check if password is provided
        if (password) {
          const hashedPassword = await bcrypt.hash(password, 10);
          userToUpdate.password = hashedPassword;
          const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.USER,
                    pass: process.env.PASS,
                },
            });

            await transporter.sendMail({
                from: '"EcoSync" <EcoSync@gmail.com>', // sender address
                to: email, // list of receivers
                subject: "Password Change in EcoSync", // Subject line
                text: "Password Change in EcoSync",
                html: `<div>
                            <p>Your New Password is: ${password}</p>
                            <p>System admin changed your password. Please change your password after login.</p>
                        </div>`,
            });
        }
        
        userToUpdate.role = role;
        await userToUpdate.save();
        
        res.status(200).json({ message: "User updated successfully" });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

// DELETE method for deleting a user (System Admin access)
exports.deleteUser = async (req, res) => {
    const userId = req.params.userId;
    const { token } = req.body;
  
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
  
        // Proceed with deleting user
        const userToDelete = await userModel.findById(userId);
        if (!userToDelete) {
          return res.status(404).json({ message: "User not found" });
        }
  
        // Check if the user to delete is a system admin
        if (userToDelete.role === "System admin") {
          return res.status(403).json({ message: "Cannot delete a system admin user" });
        }
  
        await userModel.deleteOne({ _id: userId });
        res.status(200).json({ message: "User deleted successfully" });
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
  const { roles,loguser } = req.body;
  try {
      let user = await userModel.findById(userId);
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }
      // Check if the user is a system admin
      if (loguser.role !== "System admin") {
          return res.status(403).json({ message: "Unauthorized" });
      }
      // Update user roles
      user.role = roles;
      await user.save();
      res.status(200).json({ message: "User roles updated successfully" });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

