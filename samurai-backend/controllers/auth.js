const userModel = require("../models/user_accounts");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let pass = "";
    let role = "";
    let isFirstTime = false;
    let userId = "";

    await userModel
      .findOne({ email: email })
      .then((result) => {
        if (result) {
          pass = result.password;
          role = result.role;
          isFirstTime = result.isLogin;
          userId = result._id;
        } else {
          res.status(401).json({ message: "Email is wrong!" });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
      });

    if (pass !== "") {
      bcrypt.compare(password, pass, function (err, result) {
        if (err) {
          console.log(err);
          res.status(500).json({ message: "Internal Server Error" });
        }
        if (result) {
          const token = jwt.sign({ email: email }, process.env.jwt_secret_key, {
            expiresIn: "30d",
          });

          // Update token field in the user model
          userModel
            .findByIdAndUpdate(
              userId,
              { $set: { isLogin: true, token: token } },
              { new: true }
            )
            .then((updatedUser) => {
              res
                .status(200)
                .json({ token: token, role: role, isFirstTime: isFirstTime });
            })
            .catch((err) => {
              console.log(err);
              res.status(500).json({ message: "Internal Server Error" });
            });
        } else {
          res.status(401).json({ message: "Password is wrong!" });
        }
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.Logout = async (req, res) => {
  try {
    const { token } = req.body;

    // Find the user and update the token
    const user = await userModel.findOneAndUpdate(
      { token: token },
      { $set: { token: "Nothing" } }, // or { $set: { token: '' } } if you prefer an empty string
      { new: true }
    );
    await user.save();
    return res.status(200).json({ message: "Logout successful" });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.changePassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Check if the token exists in user_account
    const user = await userModel.findOne({ token });
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();
    return res.status(200).json({ message: "Password updated successfully" });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to generate a password reset token
const generateResetToken = (email) => {
  return jwt.sign({ email }, process.env.jwt_secret_key, { expiresIn: "5m" });
};

// Generate a random string function
function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Function to send the password reset email
const sendResetEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  });

  const info = await transporter.sendMail({
    from: '"EcoSync" <EcoSync@gmail.com>', // sender address
    to: email, // recipient address
    subject: "Password Reset for EcoSync", // Subject line
    html: `<p>Click <a href="http://localhost:5173/forgot-password/${token}">here</a> to reset your password.</p>`,
  });

  //console.log('Password reset email sent:', info.response);
};

// Function to send the password reset email for mobile app
const sendResetEmailforApp = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  });

  const info = await transporter.sendMail({
    from: '"EcoSync" <EcoSync@gmail.com>', // sender address
    to: email, // recipient address
    subject: "Password Reset for EcoSync", // Subject line
    html: `<p>Your new password is ${token}</p>`,
  });

};

//reset password for mobile app
exports.ResetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the email exists in the database
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    // Generate and send password reset token
    const token = generateRandomString(6);
    await sendResetEmailforApp(email, token);
    // Hash the new password
    const hashedPassword = await bcrypt.hash(token, 10);

    // Update user's password
    user.password = hashedPassword;
    await user.save();
    res
      .status(200)
      .json({
        message:
          "Password reset initiated. Check your email for further instructions.",
      });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.initiatePasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the email exists in the database
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    // Generate and send password reset token
    const token = generateResetToken(email);
    await sendResetEmail(email, token);

    res
      .status(200)
      .json({
        message:
          "Password reset initiated. Check your email for further instructions.",
      });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.confirmPasswordReset = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    jwt.verify(token, process.env.jwt_secret_key, async(err, decoded) => {
      if (err) {
          console.error('Error verifying JWT token:', err);
          // Handle error
      } else {
          // Extract email from the decoded payload
          const email = decoded.email; // Assuming email is stored in the payload
          // Find user by token
          const user = await userModel.findOne({ email });
          // Hash the new password
          const hashedPassword = await bcrypt.hash(newPassword, 10);

          // Update user's password
          user.password = hashedPassword;
          await user.save();

          return res.status(200).json({ message: "Password reset successfully" });
      }
    });
    
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
