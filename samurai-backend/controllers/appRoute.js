const NormalUser = require('../models/normal_user');
const userModel = require("../models/user_accounts");
const Feedback = require('../models/feedback');
const PostSocial = require('../models/post');
const Volunteering = require('../models/volunteering');
const bcrypt = require("bcryptjs")
const nodemailer = require("nodemailer");

exports.addNormalUser = async (req, res) => {
    try {
      const { name, email, password } = req.body;
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
          role: "Citizen user",
        });
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.USER,
              pass: process.env.PASS,
            },
          });
  
          try{
            await transporter.sendMail({
              from: '"EcoSync" <EcoSync@gmail.com>', // sender address
              to: email, // list of receivers
              subject: "Registration Success in EcoSync", // Subject line
              text: "Registration Success in EcoSync",
              html: `<div>
                                    <p>Dear ${name}</p>
                                    <p>Your Registration in EcoSync app is successfull.</p>
                                </div>`,
            });
            return res.status(200).json({ message: "Registration successful" });
          }catch(err){
            return res.status(200).json({ message: "Registration successful" });
          }
      }
    } catch (error) {
      res.status(400).send(error);
    }
  };
  
  exports.addFeedback = async (req, res) => {
    try {
      const { user_email, role, location, type, description, photos } = req.body;
      const feedback = new Feedback({ user_email, role, location, type, description, photos });
      await feedback.save();
      res.status(201).send(feedback);
    } catch (error) {
      res.status(400).send(error);
    }
  };
  
  exports.addPostSocial = async (req, res) => {
    try {
      const { user_email, title, description } = req.body;
      const postSocial = new PostSocial({ user_email, title, description });
      await postSocial.save();
      res.status(201).send(postSocial);
    } catch (error) {
      res.status(400).send(error);
    }
  };
  
  exports.addVolunteering = async (req, res) => {
    try {
      const { type_of_work, description, date_of_work } = req.body;
      const volunteering = new Volunteering({ type_of_work, description, date_of_work });
      await volunteering.save();
      res.status(201).send(volunteering);
    } catch (error) {
      res.status(400).send(error);
    }
  };
  