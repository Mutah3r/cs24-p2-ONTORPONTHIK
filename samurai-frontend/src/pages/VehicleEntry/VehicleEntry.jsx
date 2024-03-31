import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const VehicleEntry = () => {
  const [user, setUser] = useState(null);
  const [spinner, setSpinner] = useState(false);
  const [landfills, setLandfills] = useState([]);

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

    // Validation for Weight Carrying field
    if (name === "weightCarrying" && !/^\d+([,.]\d+)?$/.test(value)) {
      return; // Do not update state if input does not match the regex
    }

    setStsFormData({
      ...stsFormData,
      [name]: value,
    });
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Check for empty fields
    for (const key in stsFormData) {
      if (stsFormData[key] === "") {
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
    axios
      .post("http://localhost:8000/sts/entry", {
        token: JSON.parse(localStorage.getItem("user")),
        registration_number: stsFormData.vehicleRegNo,
        type: stsFormData.vehicleType,
        capacity: parseInt(stsFormData.weightCarrying),
        time_of_arrival: stsFormData.arrivalTime,
        time_of_departure: stsFormData.departureTime,
        to: stsFormData.destination,
      })
      .then((res) => {
        setSpinner(false);
        if (res.data.message === "STSEntry created successfully") {
          Swal.fire({
            title: "Good job!",
            text: "Entry Added!!",
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
        weight_of_waste: parseFloat(formData.capacity),
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
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Weight Carrying:</label>
          <input
            type="text"
            name="capacity"
            pattern="[0-9]+([,.][0-9]+)?"
            value={formData.capacity}
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
            From (Ward Number):
          </label>
          <input
            type="text"
            name="from"
            value={formData.from}
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
            type="text"
            name="vehicleRegNo"
            value={stsFormData.vehicleRegNo}
            onChange={handleSTSChange}
            className="input input-bordered w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Vehicle Type:</label>
          <select
            name="vehicleType"
            value={stsFormData.vehicleType}
            onChange={handleSTSChange}
            className="select select-bordered w-full"
          >
            <option value="">Select vehicle type</option>
            <option value="Open Truck">Open Truck</option>
            <option value="Dump Truck">Dump Truck</option>
            <option value="Compactor">Compactor</option>
            <option value="Container Carrier">Container Carrier</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Weight Carrying:</label>
          <input
            type="text"
            name="weightCarrying"
            value={stsFormData.weightCarrying}
            onChange={handleSTSChange}
            className="input input-bordered w-full"
          />
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
