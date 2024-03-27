const jwt = require('jsonwebtoken');
const userModel = require('../models/user_accounts'); // Assuming your user model file is named 'userModel.js'

exports.getUserDetails = async (req, res) => {
  try {
    const token = req.query.token;

    // Check if token exists in user account
    const user = await userModel.findOne({ token });

    if (!user) {
      res.status(404).json({ message: 'Token not found' });
    } else {
      // Token exists, verify its validity
      jwt.verify(token, process.env.jwt_secret_key, (err, decoded) => {
        if (err) {
          res.status(401).json({ message: 'Invalid token' });
        } else {
          // Token is valid, return user details
          const userDetails = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          };
          res.status(200).json(userDetails);
        }
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.updateUserDetails = async (req, res) => {
    try {
      const { name, email, token } = req.body;
  
      // Find the user by old email and update the details
      const updatedUser = await userModel.findOneAndUpdate(
        { token:token },
        { $set: { name: name, email: email } },
        { new: true }
      );
  
      if (!updatedUser) {
        res.status(404).json({ message: "User not found" });
      } else {
        // Return only required fields
        const userDetails = {
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role
        };
  
        res.status(200).json({ message: "User details updated successfully", user: userDetails });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };