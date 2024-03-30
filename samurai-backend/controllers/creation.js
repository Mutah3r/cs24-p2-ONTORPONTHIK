const STS = require('../models/sts');
const userModel = require('../models/user_accounts');
const jwt = require('jsonwebtoken');
const Landfill = require('../models/landfill')
const Vehicle = require('../models/vehicle');
const STSEntry = require('../models/sts_entry')
const LandfillEntry = require('../models/landfill_entry')


// STS 

// GET method for retrieving STS information
exports.getSTSInformation = async (req, res) => {
    try {
        // Extract token from request headers
        const token = req.params.token;

        // Check if token exists in the database
        const user = await userModel.findOne({ token });
        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Verify if user is a system manager
        if (user.role !== 'System admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Retrieve all STS information from the database
        const stsInfo = await STS.find();

        // Fetch the name of the assigned manager for each STS
        const stsWithManager = await Promise.all(stsInfo.map(async (sts) => {
            // Find the manager by their MongoDB ID
            let managerName = 'Unassigned'

            if (sts.assigned_managers_id !== "-1")
            {
                const manager = await userModel.findById(sts.assigned_managers_id);
                // If manager is found, assign their name to managerName, otherwise assign 'Unassigned'
                managerName = manager ? manager.name : 'Unassigned';
            }

            // Return an object containing STS information along with assigned manager name
            return {
                ...sts.toObject(),
                assigned_managers_name: managerName
            };
        }));

        res.status(200).json(stsWithManager);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};




// POST method for creating a new STS (System Admin access)
exports.createSTS = async (req, res) => {
    try {
        // Extract token from request headers
        // Extract STS information from request body
        const { ward_number, capacity, latitude, longitude, token } = req.body;


        // Check if token exists in the database
        const user = await userModel.findOne({ token });

        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Verify if user is a system admin
        if (user.role !== 'System admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }


        // Create a new STS instance
        const newSTS = new STS({
            ward_number,
            capacity,
            latitude,
            longitude,
            assigned_managers_id: "-1"// Initial value for assigned manager ID
        });

        // Save the new STS instance to the database
        await newSTS.save();

        res.status(200).json({ message: 'STS created successfully', sts: newSTS });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};





// Landfill


// GET method for retrieving Landfill information
exports.getLandfillInformation = async (req, res) => {
    try {
        // Extract token from request headers
        const token = req.params.token;

        // Check if token exists in the database
        const user = await userModel.findOne({ token });
        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Verify if user is a system manager
        if (user.role !== 'System admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Retrieve all Landfill information from the database
        const landfillInfo = await Landfill.find();

        // Fetch the name of the assigned manager for each Landfill
        const landfillsWithManager = await Promise.all(landfillInfo.map(async (landfill) => {
            // Find the manager by their MongoDB ID

            let managerName = 'Unassigned'
            if (landfill.assigned_managers_id !== "-1")
            {
                const manager = await userModel.findById(landfill.assigned_managers_id);
                // If manager is found, assign their name to managerName, otherwise assign 'Unassigned'
                managerName = manager ? manager.name : 'Unassigned';
            }
            

            // Return an object containing Landfill information along with assigned manager name
            return {
                ...landfill.toObject(),
                assigned_managers_name: managerName
            };
        }));

        res.status(200).json(landfillsWithManager);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};




// POST method for creating a new Landfill (System Admin access)
exports.createLandfill = async (req, res) => {
    try {
        // Extract token from request headers
        // Extract Landfill information from request body
        const { name, capacity, operational_timespan, latitude, longitude, token } = req.body;

        // Check if token exists in the database
        const user = await userModel.findOne({ token });

        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Verify if user is a system admin
        if (user.role !== 'System admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Create a new Landfill instance
        const newLandfill = new Landfill({
            name,
            capacity,
            operational_timespan,
            latitude,
            longitude,
            assigned_managers_id: "-1"// Initial value for assigned manager ID
        });

        // Save the new Landfill instance to the database
        await newLandfill.save();

        res.status(200).json({ message: 'Landfill created successfully', landfill: newLandfill });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};







// STS Manager assignement




// POST method for assigning a manager to an STS (System Admin access)
exports.assignManagerToSTS = async (req, res) => {
    try {
        // Extract user_id, token, and sts_id from request body
        const { user_id, token, sts_id } = req.body;

        // Check if token exists in the database
        const user = await userModel.findOne({ token });
        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        const stsDocument = await STS.findOne({ assigned_managers_id: user_id });
  
        if (stsDocument) {
            return res.status(404).send({ message: 'This manager has already been assigned.' });
        }

        // Verify if user is a system manager
        if (user.role !== 'System admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Check if the provided user_id is an STS manager
        const assignedManager = await userModel.findById(user_id);
        if (!assignedManager || assignedManager.role !== 'STS manager') {
            return res.status(400).json({ message: 'Invalid STS manager ID' });
        }

        // Assign the manager to the specified STS
        const sts = await STS.findById(sts_id);
        if (!sts) {
            return res.status(404).json({ message: 'STS not found' });
        }

        sts.assigned_managers_id = user_id;
        await sts.save();

        res.status(200).json({ message: 'Manager assigned to STS successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};










// Landfill manager assignement



// POST method for assigning a manager to a landfill (System Admin access)
exports.assignManagerToLandfill = async (req, res) => {
    try {
        // Extract user_id, token, and landfill_id from request body
        const { user_id, token, landfill_id } = req.body;

        // Check if token exists in the database
        const user = await userModel.findOne({ token });
        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        const landfill_cc = await Landfill.findOne({ assigned_managers_id: user_id });
        if (landfill_cc) {
            return res.status(404).send({ message: 'Already this user has been assigned' });
        }

        // Verify if user is a system manager
        if (user.role !== 'System admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Check if the provided user_id is a Landfill manager
        const assignedManager = await userModel.findById(user_id);
        if (!assignedManager || assignedManager.role !== 'Landfill manager') {
            return res.status(400).json({ message: 'Invalid Landfill manager ID' });
        }

    
        // Assign the manager to the specified landfill
        const landfill = await Landfill.findById(landfill_id);
        if (!landfill) {
            return res.status(404).json({ message: 'Landfill not found' });
        }

        landfill.assigned_managers_id = user_id;
        await landfill.save();

        res.status(200).json({ message: 'Manager assigned to Landfill successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};








// POST method for adding a new vehicle
exports.addVehicle = async (req, res) => {
    try {
        // Extract vehicle information from request body
        const { token, registration_number, type, capacity, fuel_cost_per_km_loaded, fuel_cost_per_km_unloaded } = req.body;


        const user = await userModel.findOne({ token });

        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Verify if user is a system manager
        if (user.role !== 'System admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const vehicles = await Vehicle.findOne({registration_number});
        if(vehicles){
            return res.status(403).json({ message: 'The number is allready added' });
        }
        // Create a new vehicle instance
        const newVehicle = new Vehicle({
            registration_number,
            type,
            capacity,
            fuel_cost_per_km_loaded,
            fuel_cost_per_km_unloaded
        });

        // Save the new vehicle instance to the database
        await newVehicle.save();

        res.status(200).json({ message: 'Vehicle added successfully', vehicle: newVehicle });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.checkUserAssignment = async (req, res) => {
    const userId = req.params.userId;
  
    try {
      // Find the user by userId
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Check the user's role
      if (user.role === "STS manager") {
        // Check if the user is assigned in the STS model
        const sts = await STS.findOne({ assigned_managers_id: userId });
        if (sts) {
          return res.status(200).json({ isAssigned: true, work: "STS manager" });
        } else {
          return res.status(200).json({ isAssigned: false });
        }
      } else if (user.role === "Landfill manager") {
        // Check if the user is assigned in the landfill model
        const landfill = await Landfill.findOne({ assigned_managers_id: userId });
        if (landfill) {
          return res.status(200).json({ isAssigned: true, work: "Landfill manager" });
        } else {
          return res.status(200).json({ isAssigned: false });
        }
      } else {
        // User has a role other than STS manager or landfill manager
        return res.status(200).json({ isAssigned: false });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };








exports.stsLog = (async (req, res) => {
    const { 
        token, 
        registration_number, 
        type, 
        capacity, 
        time_of_arrival, 
        time_of_departure ,
        to
    } = req.body;
  
    
    const userId = await userModel.findOne({ token });
  
    try {
        if (!userId) {
            return res.status(401).json({ message: "Invalid token" });
          }
      
          // Verify the token
          jwt.verify(token, process.env.jwt_secret_key, async (err, decoded) => {
            if (err) {
              return res.status(401).json({ message: "Invalid token" });
            }
      
            // Check if the user's role is system admin
            if (userId.role !== "STS manager") {
              return res.status(403).json({ message: "Unauthorized" });
            }
      
           
          });
        const vehicle = await Vehicle.findOne({ registration_number });
        if (!vehicle) {
          return res.status(404).send({ message: 'Vehicle not found' });
        }
      const stsDocument = await STS.findOne({ assigned_managers_id: userId._id });
  
      if (!stsDocument) {
        return res.status(404).send({ message: 'STS not found for the given manager' });
      }
  
     
      const newSTSEntry = new STSEntry({
        sts_id: stsDocument._id, 
        vehicle_registration: registration_number,
        weight_of_waste: capacity,
        time_of_arrival: new Date(time_of_arrival),
        time_of_departure: new Date(time_of_departure),
        to
      });
  
      await newSTSEntry.save();
  
      res.status(201).send({ message: 'STSEntry created successfully', data: newSTSEntry });
    } catch (error) {
      console.error('Error creating STSEntry:', error);
      res.status(500).send({ message: 'Error creating STSEntry', error: error.toString() });
    }
});





exports.getSTSEntriesForManager = async (req, res) => {
    try {

        const token = req.params.token;

        // Find the user by token to get the user ID
        const user = await userModel.findOne({ token });
        if (!user) {
            return res.status(401).json({ message: "Invalid token" });
          }
      
          // Verify the token
          jwt.verify(token, process.env.jwt_secret_key, async (err, decoded) => {
            if (err) {
              return res.status(401).json({ message: "Invalid token" });
            }
      
            // Check if the user's role is system admin
            if (user.role !== "STS manager") {
              return res.status(403).json({ message: "Unauthorized" });
            }
      
           
          });
        // Find the STS document assigned to the user
        const stsDocument = await STS.findOne({ assigned_managers_id: user._id });

        if (!stsDocument) {
            return res.status(404).send({ message: 'STS not found for the given manager' });
        }

        // Retrieve all STS entries associated with the STS ID
        const stsEntries = await STSEntry.find({ sts_id: stsDocument._id });

        res.status(200).send({ message: 'STSEntries retrieved successfully', data: stsEntries });
    } catch (error) {
        console.error('Error fetching STSEntries:', error);
        res.status(500).send({ message: 'Error fetching STSEntries', error: error.toString() });
    }
};


exports.getAllSTS = async(req,res)=>{
    try{
        const token = req.params.token;

        // Find the user by token to get the user ID
        const user = await userModel.findOne({ token });
        if (!user) {
            return res.status(401).json({ message: "Invalid token" });
          }
      
          // Verify the token
          jwt.verify(token, process.env.jwt_secret_key, async (err, decoded) => {
            if (err) {
              return res.status(401).json({ message: "Invalid token" });
            }
      
            // Check if the user's role is system admin
            if (user.role !== "System admin") {
              return res.status(403).json({ message: "Unauthorized" });
            }
      
           
          });
        const stsDocument = await STSEntry.find();
        res.status(200).send({ message: 'STSEntries retrieved successfully', data: stsDocument });
    }catch(error){
        console.error('Error fetching STSEntries:', error);
        res.status(500).send({ message: 'Error fetching STSEntries', error: error.toString() });
    }
};

exports.getAllLand = async(req,res)=>{
    try{
        const token = req.params.token;

        // Find the user by token to get the user ID
        const user = await userModel.findOne({ token });
        if (!user) {
            return res.status(401).json({ message: "Invalid token" });
          }
      
          // Verify the token
          jwt.verify(token, process.env.jwt_secret_key, async (err, decoded) => {
            if (err) {
              return res.status(401).json({ message: "Invalid token" });
            }
      
            // Check if the user's role is system admin
            if (user.role !== "System admin") {
              return res.status(403).json({ message: "Unauthorized" });
            }
      
           
          });
        const stsDocument = await LandfillEntry.find();
        res.status(200).send({ message: 'LandfillEntries retrieved successfully', data: stsDocument });
    }catch(error){
        console.error('Error fetching LandfillEntries:', error);
        res.status(500).send({ message: 'Error fetching LandfillEntries', error: error.toString() });
    }
};



exports.createLandfillEntry = async (req, res) => {
    try {
        const { token, vehicle_registration, weight_of_waste, time_of_arrival, time_of_departure , from} = req.body;

        // Find the user by token to get the user ID and associated landfill
        const user = await userModel.findOne({ token });
        if (!user) {
            return res.status(401).json({ message: "Invalid token" });
          }
      
          // Verify the token
          jwt.verify(token, process.env.jwt_secret_key, async (err, decoded) => {
            if (err) {
              return res.status(401).json({ message: "Invalid token" });
            }
      
            // Check if the user's role is system admin
            if (user.role !== "Landfill manager") {
              return res.status(403).json({ message: "Unauthorized" });
            }
      
           
          });

        //console.log(vehicle_registration);
        const vehicle = await Vehicle.findOne({ registration_number:vehicle_registration });
        if (!vehicle) {
          return res.status(404).send({ message: 'Vehicle not found' });
        }

        // Check if the user is assigned as a manager to any landfill
        const landfill = await Landfill.findOne({ assigned_managers_id: user._id });
        if (!landfill) {
            return res.status(404).send({ message: 'No Landfill assigned to the manager' });
        }

        // Create a new LandfillEntry
        const newLandfillEntry = new LandfillEntry({
            landfill_id: landfill._id,
            vehicle_registration,
            weight_of_waste,
            time_of_arrival: new Date(time_of_arrival),
            time_of_departure: new Date(time_of_departure),
            from
        });

        // Save the LandfillEntry
        await newLandfillEntry.save();

        res.status(201).send({ message: 'LandfillEntry created successfully', data: newLandfillEntry });
    } catch (error) {
        console.error('Error creating LandfillEntry:', error);
        res.status(500).send({ message: 'Error creating LandfillEntry', error: error.toString() });
    }
};





exports.getLandfillEntries = async (req, res) => {
    try {
        const token = req.params.token;

        // Find the user by token to get the user ID
        const user = await userModel.findOne({ token });
        if (!user) {
            return res.status(401).json({ message: "Invalid token" });
          }
      
          // Verify the token
          jwt.verify(token, process.env.jwt_secret_key, async (err, decoded) => {
            if (err) {
              return res.status(401).json({ message: "Invalid token" });
            }
      
            // Check if the user's role is system admin
            if (user.role !== "Landfill manager") {
              return res.status(403).json({ message: "Unauthorized" });
            }
      
           
          });

        // Check if the user is assigned as a manager to any landfill
        const landfill = await Landfill.findOne({ assigned_managers_id: user._id });
        if (!landfill) {
            return res.status(404).send({ message: 'No Landfill assigned to the manager' });
        }

        // Retrieve all Landfill entries associated with the Landfill ID
        const landfillEntries = await LandfillEntry.find({ landfill_id: landfill._id });

        res.status(200).send({ message: 'LandfillEntries retrieved successfully', data: landfillEntries });
    } catch (error) {
        console.error('Error fetching LandfillEntries:', error);
        res.status(500).send({ message: 'Error fetching LandfillEntries', error: error.toString() });
    }
};


exports.getAllVehicle = async(req,res)=>{
    try{

        const vehicle = await Vehicle.find();
        return res.status(200).send({message:'All vehicle',vehicle});

    }catch(error){
        return res.status(500).send({ message: 'Internal Server Error'});
    }
}