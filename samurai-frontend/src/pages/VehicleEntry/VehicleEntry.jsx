import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const VehicleEntry = () => {
  const [user, setUser] = useState(null);
  const [spinner, setSpinner] = useState(false);
  const [landfills, setLandfills] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [availableLandfillVehicles, setAvailableLandfillVehicles] = useState([]);
  const [vehiclesType, setVehiclesType] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [input, setInput] = useState('');
  const [refetch, setRefetch] = useState(false);


  useEffect(()=>{
    axios.get('http://localhost:8000/vehicle/allstsvehicle')
    .then(res => {
      const registrationNumbers = res.data?.vehicles?.map(vehicle => vehicle.registration_number);
      setVehicles(registrationNumbers); 

      const vehiclesRegistrationNumbersAndTypes = res.data?.vehicles?.map(vehicle => {
        return {
          reg_no: vehicle.registration_number,
          type: vehicle.type,
          capacity: vehicle.capacity
        }
      });

      setVehiclesType(vehiclesRegistrationNumbersAndTypes);
    })
  }, [refetch]);

  useEffect(() => {
    axios.get(`http://localhost:8000/vehicle/alllandfillvehicle/${JSON.parse(localStorage.getItem("user"))}`)
    .then(res => {
      setAvailableLandfillVehicles(res.data?.vehicles);
    })
  },[]);

  const [formData, setFormData] = useState({
    vehicleRegNo: "",
    capacity: "",
    arrivalTime: "",
    departureTime: "",
    from: "",
  });

  const [stsFormData, setStsFormData] = useState({
    vehicleRegNo: "",
    vehicleType: "",
    weightCarrying: "",
    arrivalTime: "",
    departureTime: "",
    destination: "",
  });

  // Function to handle changes in form fields
  const handleSTSChange = (e) => {
    const { name, value } = e.target;

    setInput(value);

    // Give vehicle suggestions to the user
    if (value.length > 0) {
      const filteredSuggestions = vehicles? vehicles.filter(number =>
        number.toLowerCase().includes(value.toLowerCase())
      ) : [];
      if(name === 'vehicleRegNo'){
        // give available vehicles suggestions
        setSuggestions(filteredSuggestions);
        // update the vehicle type field if the entered vehicle matches any available vehicle
        const matchedVehicle = vehiclesType.find(vehicle => vehicle.reg_no === value);
        
        if(matchedVehicle){
          const txtBx = document.getElementById('stsVehicleType');
          txtBx.value = matchedVehicle.type;
          document.getElementById('vehicle-max-capacity').innerHTML = `Maximum Capacity: ${matchedVehicle.capacity} Ton`;
        }
        else{
          const txtBx = document.getElementById('stsVehicleType');
          txtBx.value = "";
          document.getElementById('vehicle-max-capacity').innerHTML = ``;
        }

      }
    } else {
      setSuggestions([]);
    }


    // Validation for Weight Carrying field
    if (name === "weightCarrying" && !/^\d+([,.]\d+)?$/.test(value)) {
      return; // Do not update state if input does not match the regex
    }

    setStsFormData({
      ...stsFormData,
      [name]: value,
    });
  };

  const onSuggestionClick = (value) => {
    const matchedVehicle = vehiclesType.find(vehicle => vehicle.reg_no === value);

    if(matchedVehicle){
      const txtBx = document.getElementById('stsVehicleType');
      txtBx.value = matchedVehicle.type;
      document.getElementById('vehicle-max-capacity').innerHTML = `Maximum Capacity: ${matchedVehicle.capacity} Ton`;
    }
    else{
      const txtBx = document.getElementById('stsVehicleType');
      txtBx.value = "";
      document.getElementById('vehicle-max-capacity').innerHTML = ``;
    }

    setStsFormData({
      ...stsFormData,
      vehicleRegNo: value,
    });
    setInput(value);
    setSuggestions([]);
  };







  const onSuggestionClickLandfill = (value) => {
    const matchedVehicle = availableLandfillVehicles.find(vehicle => vehicle.registration_number === value);

    if(matchedVehicle){
      setFormData({
        ...formData,
        vehicleRegNo: value,
        capacity: matchedVehicle.capacity,
        weightCarrying: matchedVehicle.carring_weight,
      });
      document.getElementById('landfillLoadCarrying').value = matchedVehicle.carring_weight;
      document.getElementById('fromStsWardNumber').value = matchedVehicle.from_sts;
    }
    else{
      document.getElementById('landfillLoadCarrying').value = "";
      document.getElementById('fromStsWardNumber').value = "";
    }

    setFormData({
      ...formData,
      vehicleRegNo: value,
      capacity: matchedVehicle.capacity,
      weightCarrying: matchedVehicle.carring_weight,
    });

    setInput(value);
    setSuggestions([]);
  };



  const SuggestionList = () => {
    if (suggestions.length === 0 || input === '') {
      return null;
    }
    return (
      <ul className="suggestions border-2 rounded-lg p-3 shadow-md">
        {suggestions.map((suggestion, index) => (
          <li className="cursor-pointer hover:bg-gray-200 py-2 px-4 rounded-lg" key={index} onClick={() => onSuggestionClick(suggestion)}>
            {suggestion}
          </li>
        ))}
      </ul>
    );
  };

  const SuggestionListLandfill = () => {
    if (suggestions.length === 0 || input === '') {
      return null;
    }
    return (
      <ul className="suggestions border-2 rounded-lg p-3 shadow-md">
        {suggestions.map((suggestion, index) => (
          <li className="cursor-pointer hover:bg-gray-200 py-2 px-4 rounded-lg" key={index} onClick={() => onSuggestionClickLandfill(suggestion)}>
            {suggestion}
          </li>
        ))}
      </ul>
    );
  };


  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // carrying weight cannot be greater than maximum weight
    const selectedVehicle = vehiclesType.find(vehicle => vehicle.reg_no === stsFormData.vehicleRegNo);
    if(selectedVehicle && parseFloat(stsFormData.weightCarrying) > parseFloat(selectedVehicle.capacity)){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Maximum allowed weight is ${selectedVehicle.capacity} Ton`,
      });

      return;
    }

    // Check for empty fields
    for (const key in stsFormData) {
      if (key !== "vehicleType" && stsFormData[key] === "") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Please fill in the ${key
            .replace(/([A-Z])/g, " $1")
            .toLowerCase()}.`,
        });
        return;
      }
    }

    setSpinner(true);
    
    const vehiType = document.getElementById('stsVehicleType').value;
    const postDataInfo = {
      token: JSON.parse(localStorage.getItem("user")),
      registration_number: stsFormData.vehicleRegNo,
      type: document.getElementById('stsVehicleType').value,
      capacity: parseFloat(vehiType == "Open Truck"? 3 : vehiType == "Dump Truck"? 5 : vehiType == "Compactor"? 7 : vehiType == "Container Carrier"? 15 : 0),
      carring_weight: parseFloat(stsFormData.weightCarrying),
      time_of_arrival: stsFormData.arrivalTime,
      time_of_departure: stsFormData.departureTime,
      to: stsFormData.destination,
    }

    // return;

    axios
      .post("http://localhost:8000/sts/entry", postDataInfo)
      .then((res) => {
        setSpinner(false);
        if (res.data.message === "STSEntry created successfully") {
          Swal.fire({
            title: "Good job!",
            text: "Entry Added!!",
            icon: "success",
          });
          
          setStsFormData({
            vehicleRegNo: "",
            vehicleType: "",
            weightCarrying: "",
            arrivalTime: "",
            departureTime: "",
            destination: "",
          });
          setVehicles([]);
          setVehiclesType([]);
          setSuggestions([]);

          setRefetch(refetch);
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          });
        }
      })
      .catch((error) => {
        setSpinner(false);
        if (error.response.data.message === "Vehicle not found") {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Vehicle not found!",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          });
        }
      });
  };

  useEffect(() => {
    axios
      .get(
        `http://localhost:8000/profile?token=${JSON.parse(
          localStorage.getItem("user")
        )}`
      )
      .then((res) => {
        setUser(res.data);
      });
  }, []);

  useEffect(() => {
    axios
      .get(
        `http://localhost:8000/facilities/allland/${JSON.parse(
          localStorage.getItem("user")
        )}`
      )
      .then((res) => {
        const namesArray = res.data.map((item) => item.name);
        setLandfills(namesArray);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setInput(value);

    // Give vehicle suggestions to the user
    if(value.length > 0){
      const filteredSuggestions = availableLandfillVehicles? availableLandfillVehicles.filter(vehicle =>
        vehicle.registration_number.toLowerCase().includes(value.toLowerCase())
      ) : [];

      const filteredSuggestionNames = filteredSuggestions.map(item => item.registration_number);



      if(name === 'vehicleRegNo'){
        setSuggestions(filteredSuggestionNames);
        const matchedVehicle = availableLandfillVehicles.find(vehicle => vehicle.registration_number === value);

        if(matchedVehicle){
          setFormData({
            ...formData,
            vehicleRegNo: value,
            capacity: matchedVehicle.capacity,
            weightCarrying: matchedVehicle.carring_weight,
          });
        document.getElementById('landfillLoadCarrying').value = matchedVehicle.carring_weight;
        document.getElementById('fromStsWardNumber').value = matchedVehicle.from_sts;
        }
        else{
          document.getElementById('landfillLoadCarrying').value = "";
          document.getElementById('fromStsWardNumber').value = "";
        }
      }
      else {
        setSuggestions([]);
      }

    }

    // Regular expression to allow only integer numbers
    const integerRegex = /^\d*$/;

    // Check if the input matches the regex
    if (name === "from" && !integerRegex.test(value)) {
      return; // Do not update state if input does not match the regex
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLandfillEntry = (e) => {
    e.preventDefault();

    // Check if any field is empty
    for (const key in formData) {
      if (formData.hasOwnProperty(key)) {
        if (formData[key] === "") {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `Please fill in the ${key
              .replace(/([A-Z])/g, " $1")
              .toLowerCase()}.`,
          });
          return;
        }
      }
    }

    setSpinner(true);
    axios
      .post("http://localhost:8000/landfill/lentry", {
        token: JSON.parse(localStorage.getItem("user")),
        vehicle_registration: formData.vehicleRegNo,
        // weight_of_waste: parseFloat(formData.capacity),
        weight_of_waste: parseFloat(formData.weightCarrying),
        time_of_arrival: formData.arrivalTime,
        time_of_departure: formData.departureTime,
        from: parseInt(formData.from),
      })
      .then((res) => {
        setSpinner(false);
        if (res.data?.message === "LandfillEntry created successfully") {
          Swal.fire({
            title: "Good job!",
            text: "Entry Added!",
            icon: "success",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          });
        }
      })
      .catch((error) => {
        setSpinner(false);
        if (error.response?.data?.message === "Vehicle not found") {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Vehicle not found!",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          });
        }
      });
  };

  if (user && user?.role === "Landfill manager") {
    return (
      <form
        onSubmit={handleLandfillEntry}
        className="max-w-md mx-auto mt-8 p-4 bg-white shadow-md rounded-lg"
      >
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Vehicle Reg. No.:</label>
          <input
            type="text"
            name="vehicleRegNo"
            value={formData.vehicleRegNo}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
          <SuggestionListLandfill />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Weight Carrying:</label>
          <input
            id="landfillLoadCarrying"
            type="text"
            name="capacity"
            pattern="[0-9]+([,.][0-9]+)?"
            // value={formData.capacity}
            disabled={true}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Time of Arrival:</label>
          <input
            type="datetime-local"
            name="arrivalTime"
            value={formData.arrivalTime}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Time of Departure:</label>
          <input
            type="datetime-local"
            name="departureTime"
            value={formData.departureTime}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">
            From (STS Ward Number):
          </label>
          <input
            disabled={true}
            type="text"
            name="from"
            id="fromStsWardNumber"
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>
        <button
          disabled={spinner}
          type="submit"
          className="btn btn-neutral w-full"
        >
          {spinner ? "Loading..." : "Submit"}
        </button>
      </form>
    );
  } else if (user && user?.role === "STS manager") {
    return (
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto mt-8 p-4 bg-white shadow-md rounded-lg"
      >
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Vehicle Reg. No.:</label>
          <input
            id="sts_vehicle_reg_no"
            type="text"
            name="vehicleRegNo"
            value={stsFormData.vehicleRegNo}
            onChange={handleSTSChange}
            className="input input-bordered w-full"
          />
          <SuggestionList />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Vehicle Type:</label>
          <input
            type="text"
            name="vehicleType"
            id="stsVehicleType"
            disabled={true}
            onChange={handleSTSChange}
            className="input input-bordered w-full"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1 text-gray-700">Weight Carrying:</label>
          <input
            type="text"
            name="weightCarrying"
            value={stsFormData.weightCarrying}
            onChange={handleSTSChange}
            className="input input-bordered w-full"
          />
        </div>
        <div className="mb-2">
          <label id="vehicle-max-capacity" className="block mb-1 text-green-500 text-right">Maximum Capacity: 10 Ton</label>
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Time of Arrival:</label>
          <input
            type="datetime-local"
            name="arrivalTime"
            value={stsFormData.arrivalTime}
            onChange={handleSTSChange}
            className="input input-bordered w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Time of Departure:</label>
          <input
            type="datetime-local"
            name="departureTime"
            value={stsFormData.departureTime}
            onChange={handleSTSChange}
            className="input input-bordered w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Destination:</label>
          <select
            name="destination"
            value={stsFormData.destination}
            onChange={handleSTSChange}
            className="select select-bordered w-full"
          >
            <option value="" disabled>
              Select landfill
            </option>

            {landfills &&
              landfills.map((landfill, idx) => (
                <option key={idx} value={landfill}>
                  {landfill}
                </option>
              ))}
          </select>
        </div>
        <button
          disabled={spinner}
          type="submit"
          className="btn btn-neutral w-full"
        >
          {spinner ? "Loading..." : "Submit"}
        </button>
      </form>
    );
  } else {
    return (
      <h1 className="text-center text-green -500 font-semibold">
        STS Logs Entry
      </h1>
    );
  }
};

export default VehicleEntry;
