import axios from "axios";
import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import Swal from "sweetalert2";

const VehicleManagement = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [refetch, setRefetch] = useState(false);
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/vehicle/allvehicle").then((res) => {
      setVehicles(res.data.vehicle);
      setIsLoading(false);
    });
  }, [refetch]);

  const handleAddVehicle = () => {
    Swal.fire({
      title: "Add New Vehicle",
      html: `
        <input id="registrationNumber" class="swal2-input" placeholder="Registration Number">
        <select id="type" class="swal2-select" placeholder="Type">
          <option value="Open Truck">Open Truck</option>
          <option value="Dump Truck">Dump Truck</option>
          <option value="Compactor">Compactor</option>
          <option value="Container Carrier">Container Carrier</option>
        </select>
        <select id="capacity" class="swal2-select" placeholder="Capacity">
          <option value="3">3 ton</option>
          <option value="5">5 ton</option>
          <option value="7">7 ton</option>
          <option value="15">15 ton</option>
        </select>
        <input id="fuelCostLoaded" class="swal2-input" placeholder="Fuel Cost per Kilo(Loaded)" type="text">
        <input id="fuelCostUnloaded" class="swal2-input" placeholder="Fuel Cost per Kilo(Unloaded)" type="text">
      `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const registrationNumber =
          document.getElementById("registrationNumber").value;
        const type = document.getElementById("type").value;
        const capacity = document.getElementById("capacity").value;
        const fuelCostLoaded = document.getElementById("fuelCostLoaded").value;
        const fuelCostUnloaded =
          document.getElementById("fuelCostUnloaded").value;

        if (
          !registrationNumber ||
          !type ||
          !capacity ||
          !fuelCostLoaded ||
          !fuelCostUnloaded
        ) {
          Swal.showValidationMessage("Please fill in all fields");
          return false;
        }

        return {
          registrationNumber,
          type,
          capacity,
          fuelCostLoaded,
          fuelCostUnloaded,
        };
      },
      didOpen: () => {
        // Add event listener to restrict input fields to accept only numeric values
        const fuelCostLoadedInput = document.getElementById("fuelCostLoaded");
        const fuelCostUnloadedInput =
          document.getElementById("fuelCostUnloaded");
        fuelCostLoadedInput.addEventListener("input", restrictToNumeric);
        fuelCostUnloadedInput.addEventListener("input", restrictToNumeric);
      },
      willClose: () => {
        // Remove event listener when the popup is closed
        const fuelCostLoadedInput = document.getElementById("fuelCostLoaded");
        const fuelCostUnloadedInput =
          document.getElementById("fuelCostUnloaded");
        fuelCostLoadedInput.removeEventListener("input", restrictToNumeric);
        fuelCostUnloadedInput.removeEventListener("input", restrictToNumeric);
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        axios
          .post("http://localhost:8000/vehicle/vehicleCreate", {
            token: JSON.parse(localStorage.getItem("user")),
            registration_number: result.value.registrationNumber,
            type: result.value.type,
            capacity: parseInt(result.value.capacity),
            fuel_cost_per_km_loaded: parseFloat(result.value.fuelCostLoaded),
            fuel_cost_per_km_unloaded: parseFloat(
              result.value.fuelCostUnloaded
            ),
          })
          .then((res) => {
            setIsLoading(false);
            if (res.data?.message === "Vehicle added successfully") {
              Swal.fire({
                title: "Good job!",
                text: "New vehicle added successfully!",
                icon: "success",
              });
              setRefetch(!refetch);
            } else {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
              });
            }
          })
          .catch((error) => {
            setIsLoading(false);
            if (
              error.response?.data?.message === "The number is allready added"
            ) {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Vehicle with this registration number already exists!",
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
              });
            }
          });
      }
    });
  };

  const restrictToNumeric = (event) => {
    const input = event.target;
    input.value = input.value.replace(/[^\d.]/g, ""); // Allow only numeric characters and dots
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex gap-3 justify-between items-center">
        <h1 className="text-2xl font-semibold mb-4">Vehicles Management</h1>
        <button className="btn btn-wide btn-outline" onClick={handleAddVehicle}>
          Add Vehicle
        </button>
      </div>

      <div className="border-2 rounded-lg my-4">
        <h2 className="text-lg font-semibold mt-6 mx-auto text-center mb-3">
          Available Vehicles
        </h2>
        {isLoading && (
          <div className="mx-auto flex justify-center items-center py-5">
            <ClipLoader
              color={"#22C55E"}
              loading={isLoading}
              size={50}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        )}
        {!isLoading && (
          <div className="overflow-x-auto pb-4">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th></th>
                  <th>Reg. No.</th>
                  <th>Type</th>
                  <th>Capacity</th>
                  <th>Fuel Cost Per Kilo (fully loaded)</th>
                  <th>Fuel Cost Per Kilo (fully unloaded)</th>
                </tr>
              </thead>
              <tbody>
                {vehicles &&
                  vehicles.map((vehicle, idx) => (
                    <tr key={vehicle._id}>
                      <th>{idx + 1}</th>
                      <td>{vehicle.registration_number}</td>
                      <td>{vehicle.type}</td>
                      <td>{vehicle.capacity + " ton"}</td>
                      <td>{vehicle.fuel_cost_per_km_loaded + {" BDT"}}</td>
                      <td>{vehicle.fuel_cost_per_km_unloaded + {" BDT"}}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleManagement;
