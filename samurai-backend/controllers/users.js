const userModel = require('../models/user_accounts')
const Role = require("../models/role")
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

exports.Registration = async(req,res)=>{
    const {name,email,password,role} = req.body
    const hashedPassword = await bcrypt.hash(password, 10);
    userModel.findOne({email:email})
    .then(async user=>{
        if(user)return res.status(401).json({message: "Email already exists"})
        else{
            userModel.create({
                name:name,
                email:email,
                password:hashedPassword,
                role:role
            })
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                  user: process.env.USER,
                  pass: process.env.PASS,
                },
              });
            const info = await transporter.sendMail({
                from: '"EcoSync" <EcoSync@gmail.com>', // sender address
                to: email, // list of receivers
                subject: "Login Credential for EcoSync", // Subject line
                text: "Login Credential for EcoSync",
                html:
                  `<div>
                            <p>Your Password is: ` +
                  password +
                  `</p><p>Please change your password after login.</p>
                        </div>`,
              });
            return res.status(200).json({message:"Registration successfull"});
        }
    })
}







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
      const user = await userModel.findOne({_id:userId});
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
  const { name, email, password, role, loguser } = req.body;
  try {
      let user = await userModel.findById(userId);
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }
      // Check if the request is made by the user or a system admin
      if (user._id.toString() !== loguser._id.toString() && loguser.role !== "System admin") {
          return res.status(403).json({ message: "Unauthorized" });
      }
      // Update user details
      user.name = name;
      user.email = email;
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      user.role = role;
      await user.save();
      res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

// DELETE method for deleting a user (System Admin access)
exports.deleteUser = async (req, res) => {
  const userId = req.params.userId;
  const { loguser } = req.body;
  try {
      const user = await userModel.findById(userId);
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }
      if (loguser.role !== "System admin" || user.role=="System admin") {
        return res.status(403).json({ message: "Unauthorized" });
      }
      await userModel.deleteOne({_id:userId});
      res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
      res.status(500).json({ message: error.message });
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

