import Swal from "sweetalert2";

const VehicleManagement = () => {
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
          <option value="3 ton">3 ton</option>
          <option value="5 ton">5 ton</option>
          <option value="7 ton">7 ton</option>
        </select>
        <input id="fuelCostLoaded" class="swal2-input" placeholder="Fuel Cost per Kilo(Loaded)" type="text">
        <input id="fuelCostUnloaded" class="swal2-input" placeholder="Fuel Cost per Kilo(Unloaded)" type="text">
      `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        return {
          registrationNumber:
            document.getElementById("registrationNumber").value,
          type: document.getElementById("type").value,
          capacity: document.getElementById("capacity").value,
          fuelCostLoaded: document.getElementById("fuelCostLoaded").value,
          fuelCostUnloaded: document.getElementById("fuelCostUnloaded").value,
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
        console.log("New vehicle details:", result.value);
        // Validate inputs here

        // Here handle saving the new vehicle details
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
              <tr>
                <th>1</th>
                <td>ABC123</td>
                <td>Open Truck</td>
                <td>5 ton</td>
                <td>$0.20</td>
                <td>$0.15</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VehicleManagement;
