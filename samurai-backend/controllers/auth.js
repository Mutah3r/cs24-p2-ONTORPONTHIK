const userModel = require('../models/user_accounts')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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