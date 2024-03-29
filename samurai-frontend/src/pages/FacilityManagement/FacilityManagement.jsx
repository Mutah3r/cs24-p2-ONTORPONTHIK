import { MdEdit } from "react-icons/md";
import Swal from "sweetalert2";

const FacilityManagement = () => {
  const handleAddSTS = () => {
    Swal.fire({
      title: "Add New STS (Solid Waste Transfer Station)",
      html: `
        <input id="wardNumber" class="swal2-input" placeholder="Ward Number">
        <input id="capacity" class="swal2-input" placeholder="Capacity (in Tonnes)">
        <input id="latitude" class="swal2-input" placeholder="Latitude">
        <input id="longitude" class="swal2-input" placeholder="Longitude">
      `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const wardNumber = document.getElementById("wardNumber").value;
        const capacity = document.getElementById("capacity").value;
        const latitude = document.getElementById("latitude").value;
        const longitude = document.getElementById("longitude").value;

        // Validate ward number, capacity, latitude, and longitude inputs
        if (
          !isValidNumber(wardNumber) ||
          !isValidNumber(capacity) ||
          !isValidCoordinate(latitude) ||
          !isValidCoordinate(longitude)
        ) {
          Swal.showValidationMessage(
            "Invalid input. Please enter numeric values."
          );
          return false;
        }

        return {
          wardNumber: parseFloat(wardNumber),
          capacity: parseFloat(capacity),
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("New STS details:", result.value);
        // Here you can handle saving the new STS details
      }
    });
  };

  const isValidNumber = (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
  };

  const isValidCoordinate = (value) => {
    return isValidNumber(value);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Facilities Management</h1>
      <div className="flex gap-3">
        <button
          className="btn btn-wide btn-outline grow"
          onClick={handleAddSTS}
        >
          Create STS
        </button>
        <button className="btn btn-wide btn-outline grow">
          Create Landfill
        </button>
      </div>

      <div className="border-2 rounded-lg my-4">
        <h2 className="text-lg font-semibold mt-6 mx-auto text-center mb-3">
          Available Landfill Sites
        </h2>
        <div className="overflow-x-auto mb-3">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Capacity</th>
                <th>Operational Time-span</th>
                <th>GPS coordinates</th>
                <th>Manager</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>1</th>
                <td>Rikabibazar Landfill</td>
                <td>50 Ton</td>
                <td>24 hours</td>
                <td className="flex flex-col justify-center gap-2">
                  <span>Latitude: 23.563037</span>
                  <span>Longitude: 90.493439</span>
                </td>
                <td>
                  <div className="flex gap-2 items-center">
                    <span>Unassigned</span>
                    <button className="p-1 flex gap-2 items-center bg-green-500 text-white hover:bg-white hover:text-green-500 text-xl rounded-md transition-all duration-200">
                      <MdEdit className="text-[20px]" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="border-2 rounded-lg my-4">
        <h2 className="text-lg font-semibold mt-6 mx-auto text-center mb-3">
          Available Secondary Transfer Stations (STS)
        </h2>
        <div className="overflow-x-auto mb-3">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Ward No.</th>
                <th>Capacity</th>
                <th>GPS coordinates</th>
                <th>Manager</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>1</th>
                <td>Rikabibazar Landfill</td>
                <td>13</td>
                <td>50 Ton</td>
                <td className="flex flex-col justify-center gap-2">
                  <span>Latitude: 23.563037</span>
                  <span>Longitude: 90.493439</span>
                </td>
                <td>
                  <div className="flex gap-2 items-center">
                    <span>Unassigned</span>
                    <button className="p-1 flex gap-2 items-center bg-green-500 text-white hover:bg-white hover:text-green-500 text-xl rounded-md transition-all duration-200">
                      <MdEdit className="text-[20px]" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FacilityManagement;
