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
const EmployeeLog = require('../models/employee_log');
const STSIncomingEntryLog = require('../models/sts_incoming_entry');

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
          role: 'Contractor Manager',
          isLogin: false,
          token: '',  // Assuming token is cleared or handled differently post-registration
          date_of_account_creation: new Date(),  // Set the creation date to current date
          contact_number,
          assigned_contractor_company, // contact id
          access_level,
          username
        });

        const updatedContractor = await ThirdPartyCnt.findByIdAndUpdate(
            assigned_contractor_company,
            { $set: { assigned_manager_id: newUser._id } },
            { new: true, runValidators: true }
        );

        if (!updatedContractor) {
            return res.status(404).send({
                message: "Contractor not found."
            });
        }

        

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
            return res.status(404).json({ message: "Invalid token" });
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




// get the name of company and sts from manager id
exports.getCompanyInfoByManagerId = async (req, res) => {
    // Decode the token to find the user
    const { token } = req.params;

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        // Fetch the user details using the token
        const user = await userModel.findOne({ token });

        if (!user) {
            return res.status(404).json({ message: "Invalid token" });
        }

        // Check if the user role is 'Contract Manager'
        if (user.role !== 'Contractor Manager') {
            return res.status(403).json({ message: "User is not a contract manager" });
        }

        // Find the company information based on the assigned manager ID
        const companyInfo = await ThirdPartyCnt.findOne({ assigned_manager_id: user._id });

        if (!companyInfo) {
            return res.status(404).json({ message: "Company information not found for the provided manager ID" });
        }

        // Extract the name of the company and designated STS
        const { name_of_the_company, designated_sts } = companyInfo;

        // Respond with the company information
        res.status(200).json({
            name_of_the_company,
            designated_sts
        });
    } catch (error) {
        console.error('Failed to retrieve company information:', error);
        res.status(500).json({ message: "Failed to retrieve company information due to server error" });
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
            return res.status(404).json({ message: "Invalid token" });
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






// Employee log 
exports.createEmployeeLog = async (req, res) => {
    try {
        const {
            employee_id,
            log_in_time,
            log_out_time,
            waste_carried
        } = req.body;

        // Fetch employee details to get the payment rate per hour
        const employee = await Employee.findById(employee_id);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        // Calculate total hours worked
        const startTime = new Date(log_in_time);
        const endTime = new Date(log_out_time);
        const duration = (endTime - startTime) / 3600000; // Duration in hours

        // Calculate waste in tons
        const wasteInTons = waste_carried / 1000;

        // Calculate total payment
        const totalPayment = duration * employee.payment_rate_per_hour;

        // Create a new log entry
        const newLog = new EmployeeLog({
            employee_id,
            date: new Date(), // default to current date, can also be passed from front-end
            log_in_time: startTime,
            log_out_time: endTime,
            total_hours_worked: duration,
            waste_carried: wasteInTons,
            total_payment: totalPayment
        });

        // Save the new employee log to the database
        await newLog.save();

        // Send a response back to the client
        res.status(201).json({
            message: "Employee log successfully created",
            log: newLog
        });
    } catch (error) {
        console.error('Failed to create a new employee log:', error);
        res.status(500).json({
            message: "Failed to create employee log due to server error",
            error: error.message
        });
    }
};



// Get Employes entries
exports.getEmployeeLogsByManagerFromToken = async (req, res) => {
    const { token } = req.params;
    const { is_today } = req.query; // Expect 'is_today' to be a query parameter

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    // Find the user by token
    const user = await userModel.findOne({ token });
    if (!user) {
        return res.status(404).json({ message: "Invalid token" });
    }

    // Check if the user role is 'Contractor Manager'
    if (user.role !== 'Contractor Manager') {
        return res.status(403).json({ message: "User is not a contract manager" });
    }

    try {
        // Fetch all employees under this manager's ID
        const employees = await Employee.find({ assigned_manager_id: user._id });
        if (!employees.length) {
            return res.status(404).json({ message: "No employees found under this manager." });
        }

        // Extract employee IDs and fetch employee details
        const employeeIds = employees.map(emp => emp._id);
        const employeeDetails = await Employee.find({ _id: { $in: employeeIds } });

        // Construct the query for logs
        const query = { employee_id: { $in: employeeIds } };
        if (is_today === 'true') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            query.date = { $gte: today, $lt: tomorrow };
        }

        // Find all logs for these employees
        const logs = await EmployeeLog.find(query);

        if (!logs.length) {
            return res.status(404).json({ message: "No logs found for employees under this manager." });
        }

        // Calculate the sum of waste carried and total payment
        const totalWasteCarried = logs.reduce((sum, log) => sum + log.waste_carried, 0);
        const totalPayment = logs.reduce((sum, log) => sum + log.total_payment, 0);

        // Convert kg to tons for the sum of waste carried
        const totalWasteCarriedTons = totalWasteCarried;

        // Add full name to each log
        const logsWithFullName = logs.map(log => {
            const employee = employeeDetails.find(emp => emp._id.toString() === log.employee_id.toString());
            return {
                ...log.toObject(),
                full_name: employee ? employee.full_name : "Unknown"
            };
        });

        // Respond with the logs and summary data
        res.status(200).json({
            message: "Logs retrieved successfully",
            logs: logsWithFullName,
            summary: {
                totalWasteCarriedTons,
                totalPayment
            }
        });
    } catch (error) {
        console.error('Failed to retrieve employee logs:', error);
        res.status(500).json({
            message: "Failed to retrieve logs due to server error",
            error: error.message
        });
    }
};



//Get employess information for last 7 days
exports.getTotalWasteAndBillLastSevenDaysSeparatedByDay = async (req, res) => {
    const { token } = req.params;

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    // Find the user by token
    const user = await userModel.findOne({ token });
    if (!user) {
        return res.status(404).json({ message: "Invalid token" });
    }

    // Check if the user role is 'Contractor Manager'
    if (user.role !== 'Contractor Manager') {
        return res.status(403).json({ message: "User is not a contract manager" });
    }

    try {
        // Fetch all employees under this manager's ID
        const employees = await Employee.find({ assigned_manager_id: user._id });
        if (!employees.length) {
            return res.status(404).json({ message: "No employees found under this manager." });
        }

        // Extract employee IDs
        const employeeIds = employees.map(emp => emp._id);

        // Calculate the date 7 days ago
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Construct the query for logs in the last seven days
        const query = {
            employee_id: { $in: employeeIds },
            date: { $gte: sevenDaysAgo }
        };

        // Find all logs for these employees in the last seven days
        const logs = await EmployeeLog.find(query);

        if (!logs.length) {
            return res.status(404).json({ message: "No logs found for employees under this manager in the last seven days." });
        }

        // Initialize an object to store total waste collected and total bill separated by day
        const totalsSeparatedByDay = {};

        // Loop through each log and calculate totals separated by day
        logs.forEach(log => {
            const date = log.date.toDateString();

            // Calculate total waste collected and total bill for the log entry
            const totalWaste = totalsSeparatedByDay[date] ? totalsSeparatedByDay[date].totalWaste + log.waste_carried : log.waste_carried;
            const totalBill = totalsSeparatedByDay[date] ? totalsSeparatedByDay[date].totalBill + log.total_payment : log.total_payment;

            // Update the totals for the day
            totalsSeparatedByDay[date] = {
                totalWaste,
                totalBill
            };
        });

        // Respond with the totals separated by day
        res.status(200).json({
            message: "Total waste collected and total bill retrieved successfully for the last seven days, separated by day",
            totalsSeparatedByDay: totalsSeparatedByDay
        });
    } catch (error) {
        console.error('Failed to retrieve total waste collected and total bill for the last seven days:', error);
        res.status(500).json({
            message: "Failed to retrieve totals for the last seven days due to server error",
            error: error.message
        });
    }
};





// post incoming and out going logs
exports.createSTSIncomingEntryLog = async (req, res) => {
    try {
        const {
            contractor_id,
            time_and_date_of_collection,
            amount_of_waste_collected, // in kilograms
            type_of_waste_collected,
            vehicle_used_for_transportation,
        } = req.body;

        // Fetch contract details to get payment_per_tonnage_of_waste and required_amount_of_waste_per_day
        const contractor = await ThirdPartyCnt.findOne({ _id: contractor_id });
        if (!contractor) {
            return res.status(404).json({ message: "Contractor not found" });
        }

        const { payment_per_tonnage_of_waste, required_amount_of_waste_per_day } = contractor;

        // Convert amount_of_waste_collected from kilograms to tons
        const amount_of_waste_collected_tons = amount_of_waste_collected / 1000;

        // Calculate basic_pay: Wc * Pt
        const basic_pay = amount_of_waste_collected_tons * payment_per_tonnage_of_waste;

        // Calculate fine: (Wr - Wc) * Pt
        const fine = (required_amount_of_waste_per_day - amount_of_waste_collected_tons) * payment_per_tonnage_of_waste;

        // Calculate total_bill: basic_pay - fine
        const total_bill = basic_pay - fine;

        // Create a new STS Incoming Entry Log entry
        const newEntryLog = new STSIncomingEntryLog({
            contractor_id,
            time_and_date_of_collection,
            amount_of_waste_collected: amount_of_waste_collected_tons,
            type_of_waste_collected,
            designated_sts_for_deposit: contractor.designated_sts, // ward_no
            vehicle_used_for_transportation,
            contract_manager_id : contractor.assigned_manager_id,
            payment_per_tonnage_of_waste,
            required_amount_of_waste_per_day,
            basic_pay,
            fine,
            total_bill
        });

        // Save the new entry log to the database
        await newEntryLog.save();

        // Respond with success message
        res.status(201).json({ message: "STS Incoming Entry Log successfully created", entryLog: newEntryLog });
    } catch (error) {
        console.error('Failed to create a new STS Incoming Entry Log:', error);
        res.status(500).json({ message: "Failed to create STS Incoming Entry Log due to server error", error: error.message });
    }
};



// get all company for a sts
exports.getContractorsBySTS = async (req, res) => {
    try {
        // Extract token from the query params
        const { token } = req.params;

        // Check if token exists
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        // Find the user by token
        const user = await userModel.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "Invalid token" });
        }

        // Find the STS details based on the user's ID
        const sts = await STS.findOne({ assigned_managers_id: user._id });
        if (!sts) {
            return res.status(404).json({ message: "STS details not found for the provided manager ID" });
        }

        // Fetch contractor details using designated_sts
        const contractors = await ThirdPartyCnt.find({ designated_sts: sts.ward_number });
        if (!contractors || contractors.length === 0) {
            return res.status(404).json({ message: "Contractors not found for the designated STS" });
        }

        // Respond with the company information of all contractors
        const companies = contractors.map(contractor => ({
            name_of_the_company: contractor.name_of_the_company,
            designated_sts: contractor.designated_sts
        }));

        res.status(200).json(companies);
    } catch (error) {
        console.error('Failed to retrieve contractors by STS:', error);
        res.status(500).json({ message: "Failed to retrieve contractors by STS due to server error", error: error.message });
    }
};


// get sts incoming long
exports.getSTSIncomingEntryLogsByToken = async (req, res) => {
    try {
        // Extract token from the query params
        const { token } = req.params;

        // Check if token exists
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        // Find the user by token
        const user = await userModel.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "Invalid token" });
        }

        // Find the STS details based on the user's ID
        const sts = await STS.findOne({ assigned_managers_id: user._id });
        if (!sts) {
            return res.status(404).json({ message: "STS details not found for the provided manager ID" });
        }

        // Find all STS incoming entry logs matching the STS ward number
        const entryLogs = await STSIncomingEntryLog.find({ designated_sts_for_deposit: sts.ward_number });

        res.status(200).json({ message: "STS incoming entry logs retrieved successfully", entryLogs });
    } catch (error) {
        console.error('Failed to retrieve STS incoming entry logs:', error);
        res.status(500).json({ message: "Failed to retrieve STS incoming entry logs due to server error", error: error.message });
    }
};



// get outgoing logs for contractor managers
exports.getOutgoingEntryLogsByToken = async (req, res) => {
    try {
        // Extract token from the query params
        const { token } = req.params;

        // Check if token exists
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        // Find the user by token
        const user = await userModel.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "Invalid token" });
        }

        let entryLogs;

        // Check if the user is a Contractor Manager
        if (user.role === 'Contractor Manager') {
            // Find STS incoming entry logs based on the contract manager ID
            entryLogs = await STSIncomingEntryLog.find({ contract_manager_id: user._id });
        } else {
            return res.status(403).json({ message: "User is not authorized to access this resource" });
        }

        res.status(200).json({ message: "STS incoming entry logs retrieved successfully", entryLogs });
    } catch (error) {
        console.error('Failed to retrieve STS incoming entry logs:', error);
        res.status(500).json({ message: "Failed to retrieve STS incoming entry logs due to server error", error: error.message });
    }
};


