const STS = require('../models/sts');
const userModel = require('../models/user_accounts');
const jwt = require('jsonwebtoken');
const Landfill = require('../models/landfill')
const Vehicle = require('../models/vehicle');
const STSEntry = require('../models/sts_entry')
const LandfillEntry = require('../models/landfill_entry')
const ThirdPartyCnt = require('../models/third_party_contractor');
const Employee = require('../models/employee');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer'); 


// /thirdparties/allthirdparties [get all thirdparty contact]
exports.getAllThirdPartyContractors = async (req, res) => { // contactor companies
    try {
        const contractors = await ThirdPartyCnt.find({});
        res.status(200).send(contractors);
    } catch (error) {
        console.error('Failed to retrieve contractors:', error);
        res.status(500).send({
            message: "Failed to retrieve data due to server error",
            error: error.message
        });
    }
};


// /thirdparties/thirdparty [post a thirdparty]
exports.addThirdPartyContractor = async (req, res) => {
        try {
            // Create a new contractor from the request body
            const newContractor = new ThirdPartyCnt({
                name_of_the_company: req.body.name_of_the_company,
                registration_id: req.body.registration_id,
                registration_date: req.body.registration_date,
                tin_of_the_company: req.body.tin_of_the_company,
                contact_number: req.body.contact_number,
                workforce_size: req.body.workforce_size,
                payment_per_tonnage_of_waste: req.body.payment_per_tonnage_of_waste,
                required_amount_of_waste_per_day: req.body.required_amount_of_waste_per_day,
                contract_duration: req.body.contract_duration,
                area_of_collection: req.body.area_of_collection, // Input a random name
                designated_sts: req.body.designated_sts, // SET it from sts drop down box
                assigned_manager_id: "-1",
                total_waste_stored: 0
            });
    
            // Save the new contractor to the database
            await newContractor.save();
    
            // Send a response back to the client
            res.status(201).send({
                message: "New third-party contractor added successfully",
                contractor: newContractor
            });
        } catch (error) {
            console.error('Error adding new contractor:', error);
            res.status(500).send({
                message: "Failed to add new contractor due to server error",
                error: error.message
            });
        }
};

// get all thirdparty company
exports.getAllThirdPartyCompanyNames = async (req, res) => {
    try {
        // Find all contractors but only return the name and _id fields
        const contractors = await ThirdPartyCnt.find({}, 'name_of_the_company _id');

        // Create a simplified list of company names and IDs
        const companyList = contractors.map(contractor => ({
            objectId: contractor._id,
            name_of_the_company: contractor.name_of_the_company
        }));

        // Return the list in the response
        res.status(200).json(companyList);
    } catch (error) {
        console.error('Failed to retrieve company names:', error);
        res.status(500).json({
            message: "Failed to retrieve data due to server error",
            error: error.message
        });
    }
};



// add new third party managers
exports.Registration = async (req, res) => {
  try {
    
    const {
      name,
      email,
      password,
      role,
      token,
      contact_number,
      assigned_contractor_company,
      access_level,
      username
    } = req.body;

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
      if (userRole !== "System admin") {
        return res.status(403).json({ message: "User is not a system admin" });
      }

      // Proceed with registration
      const hashedPassword = await bcrypt.hash(password, 10);
      const existingUser = await userModel.findOne({ email: email });

      if (existingUser) {
        return res.status(401).json({ message: "Email already exists" });
      } else {
        const newUser = await userModel.create({
          name,
          email,
          password: hashedPassword,
          role,
          isLogin: false,
          token: '',  // Assuming token is cleared or handled differently post-registration
          date_of_account_creation: new Date(),  // Set the creation date to current date
          contact_number,
          assigned_contractor_company, // contact id
          access_level,
          username
        });

        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.USER,
            pass: process.env.PASS,
          },
        });

        try {
          await transporter.sendMail({
            from: '"EcoSync" <EcoSync@gmail.com>',
            to: email,
            subject: "Login Credentials for EcoSync",
            html: `<div>
                    <p>Your Password is: ${password}</p>
                    <p>Please change your password after login.</p>
                   </div>`,
          });
          return res.status(200).json({ message: "Registration successful" });
        } catch (err) {
          console.log(err);
          return res.status(500).json({ message: "Failed to send email, but registration successful" });
        }
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};





// Create new employee [Contractor manager]
exports.createEmployee = async (req, res) => {
    try {
        // Decode the token to find the user
        const { token } = req.body;
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        // Fetch the user details using the ID from the decoded token
        const user = await userModel.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the user role is 'Contract Manager'
        if (user.role !== 'Contractor Manager') {
            return res.status(403).json({ message: "User is not a contract manager" });
        }

        // Fetch the third-party contractor details to get the assigned sts
        const contractor = await ThirdPartyCnt.findOne({ assigned_manager_id: user._id });
        if (!contractor) {
            return res.status(404).json({ message: "Assigned third-party contractor not found" });
        }

        // Create a new employee using the data in the request body
        const newEmployee = new Employee({
            full_name: req.body.full_name,
            date_of_birth: req.body.date_of_birth,
            date_of_hire: req.body.date_of_hire,
            job_title: req.body.job_title,
            payment_rate_per_hour: req.body.payment_rate_per_hour,
            contact_information: req.body.contact_information,
            assigned_collection_route: req.body.assigned_collection_route,
            assigned_manager_id: user._id,
            assigned_sts: contractor.designated_sts // from the third-party contractor model
        });

        // Save the new employee to the database
        await newEmployee.save();

        // Send a response back to the client
        res.status(201).json({
            message: "Employee successfully created",
            employee: newEmployee
        });
    } catch (error) {
        console.error('Failed to create a new employee:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token" });
        }
        res.status(500).json({
            message: "Failed to create employee due to server error",
            error: error.message
        });
    }
};




// get all employess of the current managers
exports.getEmployeesByManager = async (req, res) => {
    try {

        // Extract token from the query params
        const { token } = req.params;
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const user = await userModel.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the user role is 'Contract Manager'
        if (user.role !== 'Contractor Manager') {
            return res.status(403).json({ message: "User is not a contract manager" });
        }


        // Find all employees where the assigned_manager_id matches the user's ID
        const employees = await Employee.find({ assigned_manager_id: user._id });
        
        // Send a response with the fetched employees
        res.status(200).json({
            message: "Employees retrieved successfully",
            employees: employees
        });
    } catch (error) {
        console.error('Failed to retrieve employees:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token" });
        }
        res.status(500).json({
            message: "Failed to retrieve employees due to server error",
            error: error.message
        });
    }
};
