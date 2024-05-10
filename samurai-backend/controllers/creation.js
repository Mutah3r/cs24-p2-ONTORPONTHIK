const STS = require('../models/sts');
const userModel = require('../models/user_accounts');
const jwt = require('jsonwebtoken');
const Landfill = require('../models/landfill')
const Vehicle = require('../models/vehicle');
const STSEntry = require('../models/sts_entry')
const LandfillEntry = require('../models/landfill_entry')


// STS get or sts manager

// GET method for retrieving STS information
exports.getSTSInformation = async (req, res) => {
    try {
        
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
        // Extract STS information from request body
        const { ward_number, capacity, latitude, longitude, token } = req.body;
        
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



// Landfill for managers,


// GET method for retrieving Landfill information
exports.getLandfillInformation = async (req, res) => {
    try {
        // Extract token from request headers
        const token = req.params.token;

        // Check if token exists in the database
        const user = await userModel.findOne({ token });
        // Retrieve all Landfill information from the database
        const landfillInfo = await Landfill.find({assigned_managers_id:user._id});

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



  // [ASIF]
  exports.stsLog = async (req, res) => {
    try {
        const { 
            token, 
            registration_number, 
            capacity, 
            carring_weight,
            time_of_arrival, 
            time_of_departure ,
            to
        } = req.body;

        console.log(req.body);
        // return;

        // Find the user by token
        const userId = await userModel.findOne({ token });

        if (!userId) {
            return res.status(401).json({ message: "Invalid token" });
        }

        // Verify the token
        jwt.verify(token, process.env.jwt_secret_key, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Invalid token" });
            }

            // Check if the user's role is STS manager
            if (userId.role !== "STS manager") {
                return res.status(403).json({ message: "Unauthorized" });
            }


            const sts = await STS.findOne({ assigned_managers_id: userId._id });

            if (!sts) {
                return res.status(404).json({ message: "No STS assigned to this manager" });
            }

            // Proceed with STS log creation
            const vehicle = await Vehicle.findOne({ registration_number });

            
            if (!vehicle) {
                return res.status(404).send({ message: 'Vehicle not found' });
            }



            // Updated the vehicle [ASIF]

            console.log(carring_weight);
            try {
                const updatedVehicle = await Vehicle.findOneAndUpdate(
                    { registration_number },
                    {
                        $set: {
                            left_from_sts: true,
                            left_from_landfill: false,
                            destination_landfill: to,
                            // carrying_weight: capacity,
                            carring_weight: carring_weight,
                            from_sts: sts.ward_number
                        }
                    },
                );
            
                if (!updatedVehicle) {
                    console.log('No document found with that registration number.');
                } else {
                    console.log('Update successful:', updatedVehicle);
                }
            } catch (error) {
                console.error('Error updating the vehicle:', error);
            }

            // console.log(type)

            const stsDocument = await STS.findOne({ assigned_managers_id: userId._id });

            if (!stsDocument) {
                return res.status(404).send({ message: 'STS not found for the given manager' });
            }

            // Create a new STS entry
            const newSTSEntry = new STSEntry({
                sts_id: stsDocument._id, 
                vehicle_registration: registration_number,
                weight_of_waste: carring_weight,
                time_of_arrival: new Date(time_of_arrival),
                time_of_departure: new Date(time_of_departure),
                to
            });

            await newSTSEntry.save();

            res.status(201).send({ message: 'STSEntry created successfully', data: newSTSEntry });
        });
    } catch (error) {
        console.error('Error creating STSEntry:', error);
        res.status(500).send({ message: 'Error creating STSEntry', error: error.toString() });
    }
};





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

            // Check if the user's role is STS manager
            if (user.role !== "STS manager") {
                return res.status(403).json({ message: "Unauthorized" });
            }

            // Find the STS document assigned to the user
            const stsDocument = await STS.findOne({ assigned_managers_id: user._id });

            if (!stsDocument) {
                return res.status(404).send({ message: 'STS not found for the given manager' });
            }

            // Retrieve all STS entries associated with the STS ID
            const stsEntries = await STSEntry.find({ sts_id: stsDocument._id });

            // Populate entries with STS latitude and longitude
            const populatedEntries = await Promise.all(stsEntries.map(async (entry) => {
                // Find the STS document for the entry
                const sts = await STS.findById(entry.sts_id);
                // Find the Landfill document for the 'to' field
                const landfill = await Landfill.findOne({ name: entry.to });

                return {
                    ...entry.toObject(),
                    sts_name: sts.ward_number,
                    sts_latitude: sts.latitude,
                    sts_longitude: sts.longitude,
                    landfill_latitude: landfill.latitude,
                    landfill_longitude: landfill.longitude
                };
            }));

            return res.status(200).send({ message: 'STSEntries retrieved successfully', data: populatedEntries });
        });
    } catch (error) {
        console.error('Error fetching STSEntries:', error);
        return res.status(500).send({ message: 'Error fetching STSEntries', error: error.toString() });
    }
};


exports.getAllSTS = async (req, res) => {
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
        jwt.verify(token, process.env.jwt_secret_key, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Invalid token" });
            }
        
            // Check if the user's role is system admin
            if (user.role !== "System admin") {
                return res.status(403).json({ message: "Unauthorized" });
            }
        
            // Find the STS document assigned to the user
            const stsEntries = await STSEntry.find();
        
                const populatedEntries = await Promise.all(stsEntries.map(async (entry)=>{
                    const sts_document = await STS.findById(entry.sts_id);
                    return {
                        ...entry.toObject(),
                        sts_name : sts_document.ward_number
                    }
                }));
        
                res.status(200).json({message: "All sts entries", data: populatedEntries});
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.getAllLand = async (req, res) => {
    try {
        // Extract token from request headers
        const token = req.params.token;

        // Check if token exists in the database
        const user = await userModel.findOne({ token });
        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Verify if user is a system manager
        if (user.role !== 'System admin' && user.role !== 'STS manager') {
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

exports.createLandfillEntry = async (req, res) => {
    try {
        const { token, vehicle_registration, weight_of_waste, time_of_arrival, time_of_departure , from} = req.body;

        // Find the user by token to get the user ID and associated landfill
        const user = await userModel.findOne({ token });
        if (!user) {
            return res.status(401).json({ message: "Invalid token" });
        }

        // Verify the token
        try {
            jwt.verify(token, process.env.jwt_secret_key);
        } catch (err) {
            return res.status(401).json({ message: "Invalid token" });
        }

        // Check if the user's role is Landfill manager
        if (user.role !== "Landfill manager") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const vehicle = await Vehicle.findOne({ registration_number: vehicle_registration });
        if (!vehicle) {
            return res.status(404).send({ message: 'Vehicle not found' });
        }



        // Updated the vehicle [ASIF]
        try {
            const updatedVehicle = await Vehicle.findOneAndUpdate(
                { vehicle_registration },
                {
                    $set: {
                        left_from_sts: false,
                        left_from_landfill: true,
                        destination_landfill: "None",
                        carrying_weight: 0,
                        from_sts: "None"
                    }
                },
            );
        
            if (!updatedVehicle) {
                console.log('No document found with that registration number.');
            } else {
                console.log('Update successful:', updatedVehicle);
            }
        } catch (error) {
            console.error('Error updating the vehicle:', error);
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
        try {
            jwt.verify(token, process.env.jwt_secret_key);
        } catch (err) {
            return res.status(401).json({ message: "Invalid token" });
        }

        // Check if the user's role is Landfill manager
        if (user.role !== "Landfill manager") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // Check if the user is assigned as a manager to any landfill
        const landfill = await Landfill.findOne({ assigned_managers_id: user._id });
        if (!landfill) {
            return res.status(404).send({ message: 'No Landfill assigned to the manager' });
        }

        // Retrieve all Landfill entries associated with the Landfill ID
        const landfillEntries = await LandfillEntry.find({ landfill_id: landfill._id });
        const populatedEntries = await Promise.all(landfillEntries.map(async (entry) =>{
            const landfill = await Landfill.findById(entry.landfill_id);
            return {
                ...entry.toObject(),
                name : landfill.name
            }
        }));


        res.status(200).send({ message: 'LandfillEntries retrieved successfully', data: populatedEntries });
    } catch (error) {
        console.error('Error fetching LandfillEntries:', error);
        res.status(500).send({ message: 'Error fetching LandfillEntries', error: error.toString() });
    }
};

exports.getLandfillEntriesAdmin = async (req, res) => {
    try {
        const token = req.params.token;

        // Find the user by token to get the user ID
        const user = await userModel.findOne({ token });
        if (!user) {
            return res.status(401).json({ message: "Invalid token" });
        }

        // Verify the token
        try {
            jwt.verify(token, process.env.jwt_secret_key);
        } catch (err) {
            return res.status(401).json({ message: "Invalid token" });
        }

        // Check if the user's role is Landfill manager
        if (user.role !== "System admin") {
            return res.status(403).json({ message: "Unauthorized" });
        }




        // Check if the user is assigned as a manager to any landfill
        const landfillentry = await LandfillEntry.find();
        const populatedEntries = await Promise.all(landfillentry.map(async (entry) =>{
            const landfill = await Landfill.findById(entry.landfill_id);
            return {
                ...entry.toObject(),
                name : landfill.name
            }
        }));

       

        res.status(200).send({ message: 'LandfillEntries retrieved successfully', data: populatedEntries });
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










// [ASIF]
exports.getAvailableVehicleForSTS = async(req, res) => {
    try {
        const vehicles = await Vehicle.find({ left_from_landfill: true });

        return res.status(200).send({ message: 'Available vehicles', vehicles });
    } catch (error) {
        console.error('Error retrieving available vehicles:', error);
        return res.status(500).send({ message: 'Internal Server Error', error: error.toString() });
    }
};



// [ASIF] [ASIF]
exports.getAvailableVehicleForSTSFleetView = async(req, res) => {
    try {
        const vehicles = await Vehicle.find({ left_from_landfill: true });

        // Initialize counts for each type of vehicle
        let fleetComposition = {
            open_truck: 0,
            dump_truck: 0,
            compactor: 0,
            container_carrier: 0
        };

        // Tally up each vehicle type
        vehicles.forEach(vehicle => {
            const typeKey = vehicle.type.replace(/\s+/g, '_').toLowerCase(); // Normalize the type to match your fleetComposition keys
            if (fleetComposition.hasOwnProperty(typeKey)) {
                fleetComposition[typeKey]++;
            }
        });

        // Send the response with vehicle counts
        return res.status(200).send(fleetComposition);
    } catch (error) {
        console.error('Error retrieving available vehicles:', error);
        return res.status(500).send({ message: 'Internal Server Error', error: error.toString() });
    }
};




// [ASIF] [ASIF] [ASIF]
exports.getAvailableVehicleForSTSFleetOptimized = async(req, res) => {
    try {
        // Extract parameters from the query string
        const { token, Open_Truck = "None", Dump_Truck = "None", Compactor = "None", Container_Carrier = "None", total_waste } = req.query;

        // Convert total_waste from string to number and validate
        const waste = parseInt(total_waste, 10);
        if (isNaN(waste)) {
            return res.status(400).json({ message: "Invalid 'total_waste' parameter, must be a number." });
        }

        // Validate and authenticate the user
        const user = await userModel.findOne({ token });
        if (!user) {
            return res.status(401).json({ message: "Invalid token" });
        }

        // Verify the token
        try {
            jwt.verify(token, process.env.JWT_SECRET_KEY);
        } catch (err) {
            return res.status(401).json({ message: "Token verification failed" });
        }

        // Authorization check
        if (user.role !== "STS manager") {
            return res.status(403).json({ message: "Unauthorized access, user must be an STS manager" });
        }

        // Prepare dynamic query for vehicle types based on provided parameters
        let typeConditions = [];
        if (Open_Truck !== "None") typeConditions.push({ type: Open_Truck });
        if (Dump_Truck !== "None") typeConditions.push({ type: Dump_Truck });
        if (Compactor !== "None") typeConditions.push({ type: Compactor });
        if (Container_Carrier !== "None") typeConditions.push({ type: Container_Carrier });

        const vehicles = await Vehicle.find({
            left_from_landfill: true,
            ...(typeConditions.length > 0 && {$or: typeConditions})
        });

        if (!vehicles.length) {
            return res.status(404).json({ message: 'No available vehicles match the selected types' });
        }

        // Check if total capacity meets required waste clearance
        const totalCapacity = vehicles.reduce((sum, vehicle) => sum + vehicle.capacity, 0);
        if (totalCapacity < waste) {
            return res.status(400).json({ message: 'Available fleet cannot clear out all the waste' });
        }

        // Compute average costs per vehicle type
        let typeCosts = {};
        vehicles.forEach(vehicle => {
            const typeKey = vehicle.type.replace(/\s+/g, '_').toLowerCase();
            typeCosts[typeKey] = typeCosts[typeKey] || { sum: 0, count: 0 };
            const cost = (vehicle.fuel_cost_per_km_loaded + vehicle.fuel_cost_per_km_unloaded) / 2;
            typeCosts[typeKey].sum += cost;
            typeCosts[typeKey].count++;
        });

        Object.keys(typeCosts).forEach(type => {
            typeCosts[type] = typeCosts[type].sum / typeCosts[type].count;
        });

        // Initialize DP arrays
        let dp = Array(200).fill(Infinity); // Size according to the maximum capacity of a landfill
        let id = Array.from({ length: 200 }, () => []);
        dp[0] = 0;

        vehicles.forEach((vehicle, index) => {
            const typeKey = vehicle.type.replace(/\s+/g, '_').toLowerCase();
            const cost = typeCosts[typeKey];
            for (let j = 199; j >= vehicle.capacity; j--) {
                if (dp[j] > dp[j - vehicle.capacity] + cost) {
                    dp[j] = dp[j - vehicle.capacity] + cost;
                    id[j] = [...id[j - vehicle.capacity]];
                    id[j].push(index);
                }
            }
        });

        let modified_total_waste = waste;
        let mn = dp[modified_total_waste];
        let ans_wer = modified_total_waste;
        for(; modified_total_waste <= totalCapacity; modified_total_waste++) {
            if (mn > dp[modified_total_waste]) {
                ans_wer = modified_total_waste;
                mn = dp[modified_total_waste];
            }
        }

        modified_total_waste = ans_wer;

        // Extract the fleet composition
        let fleetComposition = {
            open_truck: 0,
            dump_truck: 0,
            compactor: 0,
            container_carrier: 0
        };
        id[modified_total_waste].forEach(idx => {
            const type = vehicles[idx].type.replace(/\s+/g, '_').toLowerCase();  // Convert 'Open Truck' to 'open_truck'
            fleetComposition[type]++;
        });

        // Final response with specific format
        return res.status(200).send({
            message: 'Optimal total cost per kilometer: ' + dp[modified_total_waste],
            total_cost_per_km: dp[modified_total_waste],
            open_truck: fleetComposition.open_truck,
            dump_truck: fleetComposition.dump_truck,
            compactor: fleetComposition.compactor,
            container_carrier: fleetComposition.container_carrier
        });

    } catch (error) {
        console.error('Error retrieving available vehicles:', error);
        return res.status(500).send({ message: 'Internal Server Error', error: error.toString() });
    }
};








// [ASIF]
exports.getAvailableVehicleForLandfill = async(req, res) => {
    try {
        const token = req.params.token;

        
        const user = await userModel.findOne({ token });
        if (!user) {
            return res.status(401).json({ message: "Invalid token" });
        }
        
        try {
            jwt.verify(token, process.env.JWT_SECRET_KEY);
        } catch (err) {
            return res.status(401).json({ message: "Invalid token" });
        }

        if (user.role !== "Landfill manager") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        
        const landfill = await Landfill.findOne({ assigned_managers_id: user._id });

        if (!landfill) {
            return res.status(404).send({ message: 'No Landfill assigned to the manager' });
        }
        const vehicles = await Vehicle.find({
            left_from_sts: true,
            destination_landfill: landfill.name
        });

        return res.status(200).send({ message: 'Available vehicles for landfill', vehicles });
    } catch (error) {
        console.error('Error retrieving available vehicles:', error);
        return res.status(500).send({ message: 'Internal Server Error', error: error.toString() });
    }
};






exports.getBillingInfo = async (req, res) => {
    try {
        const token = req.params.token;

        // Find the user by token to get the user ID
        const user = await userModel.findOne({ token });
        if (!user) {
            return res.status(401).json({ message: "Invalid token" });
        }

        // Verify the token
        try {
            jwt.verify(token, process.env.jwt_secret_key);
        } catch (err) {
            return res.status(401).json({ message: "Invalid token" });
        }

        // Check if the user's role is Landfill manager
        if (user.role !== "Landfill manager") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // Check if the user is assigned as a manager to any landfill
        const landfill = await Landfill.findOne({ assigned_managers_id: user._id });
        if (!landfill) {
            return res.status(404).send({ message: 'No Landfill assigned to the manager' });
        }

        // Retrieve all Landfill entries associated with the Landfill ID
        const landfillEntries = await LandfillEntry.find({ landfill_id: landfill._id });
        const populatedEntries = await Promise.all(landfillEntries.map(async (entry) =>{
           
            const landfill = await Landfill.findById(entry.landfill_id);
           
            const vehicleDetails = await Vehicle.findOne({ registration_number: entry.vehicle_registration });
            const fuel_cost_per_km = vehicleDetails.fuel_cost_per_km_unloaded + (entry.weight_of_waste / vehicleDetails.capacity) * (vehicleDetails.fuel_cost_per_km_loaded - vehicleDetails.fuel_cost_per_km_unloaded);
            return {
                ...entry.toObject(),
                name : landfill.name,
                cost_per_km : fuel_cost_per_km,
                track_details : vehicleDetails.type
            }
        }));


        res.status(200).send({ message: 'LandfillEntries retrieved successfully', data: populatedEntries });
    } catch (error) {
        console.error('Error fetching LandfillEntries:', error);
        res.status(500).send({ message: 'Error fetching LandfillEntries', error: error.toString() });
    }
};