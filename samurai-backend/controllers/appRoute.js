const NormalUser = require('../models/normal_user');
const userModel = require("../models/user_accounts");
const Feedback = require('../models/feedback');
const PostSocial = require('../models/post');
const Volunteering = require('../models/volunteering');
const Post = require('../models/post');
const bcrypt = require("bcryptjs")
const nodemailer = require("nodemailer");
const OpenAI = require("openai");


const openai = new OpenAI({
  apiKey: process.env.openai_key,
});

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
      const { user_email, role, location, type, description } = req.body;
      const feedback = new Feedback({ user_email, role, location, type, description});
      await feedback.save();
      res.status(201).send(feedback);
    } catch (error) {
      res.status(400).send(error);
    }
  };
  
  exports.addPostSocial = async (req, res) => {
    try {
      const { user_email, title, description,time } = req.body;
      const postSocial = new PostSocial({ user_email, title, description,time });
      await postSocial.save();
      res.status(201).send(postSocial);
    } catch (error) {
      res.status(400).send(error);
    }
  };
  
  exports.addVolunteering = async (req, res) => {
    try {
      const { type_of_work, description, date_of_work,location } = req.body;
      const volunteering = new Volunteering({ type_of_work, description, date_of_work,location });
      await volunteering.save();
      res.status(200).send(volunteering);
    } catch (error) {
      res.status(400).send(error);
    }
  };

  //educational resource
  exports.Resource = async (req, res) => {
    try {
      
        let instructionsAndResources = `Please provide some educational resources on waste management practices,recycling 
        guidelines,composting techniques, and environmental conservation based on the need of Bangladesh, add some resource link.`;
  
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: instructionsAndResources }],
        });
  
        res.status(200).json(response.choices[0]);
      
    } catch (error) {
      res.status(404).send(error);
    }
  };

  exports.post = async (req, res) => {
    try {
        const posts = await Post.find().sort({ time: -1 }); // Sort by time in descending order
        res.status(200).json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}

exports.volunteering = async (req, res) => {
  try {
      const posts = await Volunteering.find(); // Sort by time in descending order
      res.status(200).json(posts);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
  }
}

exports.getFeedback = async (req, res) => {
  try {
      const feeds = await Feedback.find(); // Sort by time in descending order
      res.status(200).json(feeds);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
  }
}

  