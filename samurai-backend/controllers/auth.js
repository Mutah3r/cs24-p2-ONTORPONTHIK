const user = require('../models/user_accounts')
const bcrypt = require("bcryptjs");

exports.Registration = async(req,res)=>{
    const {name,email,password,role} = req.body
    const hashedPassword = await bcrypt.hash(password, 10);
    user.findOne({email:email})
    .then(async user=>{
        if(user)return res.status(401).json({message: "Email already exists"})
        else{
            user.create({
                name:name,
                email:email,
                password:hashedPassword,
                role:role
            })
            return res.status(200).json({message:"Registration successfull"});
        }
    })
}