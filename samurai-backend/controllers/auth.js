const userModel = require('../models/user_accounts')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');

exports.Login = async(req,res)=>{
  try {
    const { email, password } = req.body;
    let pass = "";
    let role = "";
    await userModel.findOne({ email:email })
      .then((result) => {
        pass = result.password;
        role = result.role;
      })
      .catch((err) => {
        //console.log(pass)
      });
    if (pass == "") {
      res.status(401).json({message:"Email is wrong!"});
    } else {
      bcrypt.compare(password, pass, function (err, result) {
        if (err) console.log(err);
        if (result) {
          const token = jwt.sign(
            { email:email },
            process.env.jwt_secret_key,
            { expiresIn: "30d" }
          );
          res.status(200).json({ token: token,role:role });
        } else {
          res.status(401).json({message:"Password is wrong!"});
        }
      });
    }
  } catch (error) {
    res.status(404).json({message:"Some Error Occured"});
  }
}









exports.Logout = async (req, res) => {
  // Clear user session or token
  res.status(200).json({ message: "Logout successful" });
};








exports.changePassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedNewPassword;

    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};










// Function to generate a password reset token
const generateResetToken = (email) => {
    return jwt.sign({ email }, process.env.JWT_RESET_SECRET, { expiresIn: '1h' });
};

// Function to send the password reset email
const sendResetEmail = async (email, token) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.USER,
            pass: process.env.PASS,
        },
    });

    const info = await transporter.sendMail({
        from: '"EcoSync" <EcoSync@gmail.com>', // sender address
        to: email, // recipient address
        subject: 'Password Reset for EcoSync', // Subject line
        html: `<p>Click <a href="http://yourwebsite.com/reset-password/confirm?token=${token}">here</a> to reset your password.</p>`,
    });

    console.log('Password reset email sent:', info.response);
};

exports.initiatePasswordReset = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if the email exists in the database
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Email not found' });
        }

        // Generate and send password reset token
        const token = generateResetToken(email);
        await sendResetEmail(email, token);

        res.status(200).json({ message: 'Password reset initiated. Check your email for further instructions.' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.confirmPasswordReset = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        // Verify and decode the token
        jwt.verify(token, process.env.JWT_RESET_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(400).json({ message: 'Invalid or expired token' });
            }

            // Find user by email
            const user = await userModel.findOne({ email: decoded.email });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Hash the new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Update user's password
            user.password = hashedPassword;
            await user.save();

            res.status(200).json({ message: 'Password reset successfully' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
