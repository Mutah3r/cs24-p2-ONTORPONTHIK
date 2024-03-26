const userModel = require('../models/user_accounts')
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