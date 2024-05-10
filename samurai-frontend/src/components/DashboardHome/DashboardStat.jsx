import axios from "axios";
import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import Swal from "sweetalert2";
import { BiMap } from "react-icons/bi";
import { formatTimeToHumanReadable } from "../../utils/timeUtils";
import STSLogsChart from "./STSLogsChart";
import LandfillLogsChart from "./LandfillLogsChart";

// Component to display different types of log data based on user role
const DashboardStat = ({ user }) => {
  // State variables for managing data and UI states
  const [loading, setLoading] = useState(true);  // Overall loading state for the component
  const [logsLoading, setLogsLoading] = useState(true);  // Specific loading state for log data
  const [stsLogs, setStsLogs] = useState(null);  // Store STS logs
  const [filteredStsLogs, setFilteredStsLogs] = useState([]);  // Store filtered STS logs
  const [landfillLogs, setLandfillLogs] = useState(null);  // Store landfill logs
  const [filteredLandfillLogs, setFilteredLandfillLogs] = useState([]);  // Store filtered landfill logs
  const [error, setError] = useState(false);  // Error state

  // fetch data based on user role
  useEffect(() => {
    setLoading(true);
    if (user.role === "STS manager") {
      axios
        .get(
          `http://localhost:8000/sts/entry/${JSON.parse(
            localStorage.getItem("user")
          )}`
        )
        .then((res) => {
          setStsLogs(res.data.data); // Set the fetched STS logs
          setFilteredStsLogs(res.data.data); // Initialize the filtered logs
          setLoading(false);
          setLogsLoading(false);
        })
        .catch(() => {
          setError(true);
          setLoading(false);
        });
    } else if (user.role === "Landfill manager") {
      setLoading(true);
      axios
        .get(
          `http://localhost:8000/landfill/lentry/${JSON.parse(
            localStorage.getItem("user")
          )}`
        )
        .then((res) => {
          setLandfillLogs(res.data.data); // Set the fetched landfill logs
          setFilteredLandfillLogs(res.data.data); // Initialize the filtered logs
          setLoading(false);
          setLogsLoading(false);
        })
        .catch(() => {
          setError(true);
          setLoading(false);
        });
    }
  }, []);

  // Handlers for form submissions to filter logs based on the selected time range
  const handleTimeSubmitSTS = (event) => {
    event.preventDefault();
    // Form handling and filtering logic for STS logs
    const startTime = document.getElementById("startTimeSTS");
    const endTime = document.getElementById("endTimeSTS");
    const selectedStartTime = new Date(startTime.value);
    const selectedEndTime = new Date(endTime.value);

    if (
      selectedStartTime.toString() === "Invalid Date" ||
      selectedEndTime.toString() === "Invalid Date"
    ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select valid start and end times.",
      });
      return;
    } else if (selectedEndTime <= selectedStartTime) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "End time must be greater than start time.",
      });
      return;
    }

    const startTimeMili = selectedStartTime.getTime();
    const endTimeMili = selectedEndTime.getTime();

    const filteredLogs = stsLogs.filter((log) => {
      const departureTime = new Date(log.time_of_departure).getTime();
      return departureTime >= startTimeMili && departureTime <= endTimeMili;
    });

    setFilteredStsLogs(filteredLogs);
  };

  const handleTimeSubmitLandfill = (event) => {
    event.preventDefault();
    // Similar form handling and filtering logic for landfill logs
    const startTime = document.getElementById("startTimeLandfill");
    const endTime = document.getElementById("endTimeLandfill");
    const selectedStartTime = new Date(startTime.value);
    const selectedEndTime = new Date(endTime.value);

    if (
      selectedStartTime.toString() === "Invalid Date" ||
      selectedEndTime.toString() === "Invalid Date"
    ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select valid start and end times.",
      });
      return;
    } else if (selectedEndTime <= selectedStartTime) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "End time must be greater than start time.",
      });
      return;
    }

    const startTimeMili = selectedStartTime.getTime();
    const endTimeMili = selectedEndTime.getTime();

    const filteredLogs = landfillLogs.filter((log) => {
      const departureTime = new Date(log.time_of_departure).getTime();
      return departureTime >= startTimeMili && departureTime <= endTimeMili;
    });

    setFilteredLandfillLogs(filteredLogs);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Dashboard {(stsLogs && stsLogs[0])? ` - ${stsLogs[0].sts_name}` : ""} {(landfillLogs && landfillLogs[0])? ` - ${landfillLogs[0].name}` : ""}</h1>

      {/* Show loader while fetching data */}
      {loading && (
        <div className="flex items-center w-full justify-center py-3">
          <ClipLoader
            color={"#22C55E"}
            loading={loading}
            size={50}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )}

      {/* Conditionally render the STS manager dashboard if the user has the STS manager role and data is available */}
      {!loading && user.role === "STS manager" && stsLogs && (
        <div className="border-2 rounded-lg my-4 pb-5">
          {/* Week Summary */}
          <div className="border-2 rounded-lg my-4 pb-5">
            <h2 className="text-lg font-semibold mt-6 mx-auto text-center mb-3">
                Week Summary
            </h2>
            <div>
              <STSLogsChart logsData={stsLogs} />
            </div>
          </div>

          <h2 className="text-lg font-semibold mt-6 mx-auto text-center mb-3">
            STS Logs
          </h2>

          {/* Form for selecting time range for STS logs */}
          <div className="mt-5">
            <form className="px-8 pt-6 pb-8 mb-4">
              <div className="mb-4">
                <label
                  htmlFor="startTimeSTS"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Select Start Time:
                </label>
                <input
                  type="datetime-local"
                  id="startTimeSTS"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="endTimeSTS"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Select End Time:
                </label>
                <input
                  type="datetime-local"
                  id="endTimeSTS"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  onClick={handleTimeSubmitSTS}
                  type="submit"
                  className="btn btn-neutral"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>

          {/* Display of STS logs */}
          {!logsLoading && (
            <div className="overflow-x-auto">
              <h1 className="text-center text-green-500 font-semibold">
                Total Wastes{" "}
                <span>
                  {filteredStsLogs
                    .reduce((total, item) => total + item.weight_of_waste, 0)
                    .toFixed(2)}{" "}
                  ton
                </span>
              </h1>
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th></th>
                    <th>Ward No.</th>
                    <th>Vehicle Reg. No.</th>
                    <th>Carried Waste</th>
                    <th>Optimum Route To Landfill</th>
                    <th>Time of Departure</th>
                    <th>Time of Arrival</th>
                    <th>Destination Landfill</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStsLogs &&
                    filteredStsLogs.map((log, idx) => (
                      <tr key={log._id}>
                        <th>{idx + 1}</th>
                        <td>{log.sts_name}</td>
                        <td>{log.vehicle_registration}</td>
                        <td>{log.weight_of_waste + " ton"}</td>
                        <td className="flex items-center justify-center">
                          <a
                            href={`https://www.google.com/maps/dir/${log.sts_latitude},${log.sts_longitude}/${log.landfill_latitude},${log.landfill_longitude}`}
                            target="_blank"
                          >
                            <button className="btn btn-neutral flex items-center">
                              <BiMap className="text-[20px]" />
                            </button>
                          </a>
                        </td>
                        <td>
                          {formatTimeToHumanReadable(log.time_of_departure)}
                        </td>
                        <td>
                          {formatTimeToHumanReadable(log.time_of_arrival)}
                        </td>
                        <td>{log.to}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Conditional rendering for the Landfill manager dashboard */}
      {!loading && user.role === "Landfill manager" && landfillLogs && (
        <div className="border-2 rounded-lg my-4 pb-5">
          {/* Week Summary */}
          <div className="border-2 rounded-lg my-4 pb-5">
            <h2 className="text-lg font-semibold mt-6 mx-auto text-center mb-3">
                Week Summary
            </h2>
            <div>
              <LandfillLogsChart logsData={landfillLogs} />
            </div>
          </div>

          <h2 className="text-lg font-semibold mt-6 mx-auto text-center mb-3">
            Landfill Logs
          </h2>

          {/* Form for selecting time range for landfill logs */}
          <div className="mt-5">
            <form className="px-8 pt-6 pb-8 mb-4">
              <div className="mb-4">
                <label
                  htmlFor="startTimeLandfill"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Select Start Time:
                </label>
                <input
                  type="datetime-local"
                  id="startTimeLandfill"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="endTimeLandfill"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Select End Time:
                </label>
                <input
                  type="datetime-local"
                  id="endTimeLandfill"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  onClick={handleTimeSubmitLandfill}
                  type="submit"
                  className="btn btn-neutral"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>

          {/* Display of landfill logs */}
          {!logsLoading && (
            <div className="overflow-x-auto">
              <h1 className="text-center text-green-500 font-semibold">
                Total Wastes{" "}
                <span>
                  {filteredLandfillLogs
                    .reduce((total, item) => total + item.weight_of_waste, 0)
                    .toFixed(2)}{" "}
                  ton
                </span>
              </h1>
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Vehicle Reg. No.</th>
                    <th>Carried Waste</th>
                    <th>Time of Departure</th>
                    <th>Time of Arrival</th>
                    <th>From (Word No.)</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLandfillLogs &&
                    filteredLandfillLogs.map((log, idx) => (
                      <tr key={log._id}>
                        <th>{idx + 1}</th>
                        <td>{log.name}</td>
                        <td>{log.vehicle_registration}</td>
                        <td>{log.weight_of_waste + " ton"}</td>
                        <td>
                          {formatTimeToHumanReadable(log.time_of_departure)}
                        </td>
                        <td>
                          {formatTimeToHumanReadable(log.time_of_arrival)}
                        </td>
                        <td>{log.from}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Display Incoming Logs */}
      {!loading && user.role === "STS manager" && stsLogs && (
          <>
            <div className="border-2 rounded-lg my-4 pb-5">
              <h2 className="text-lg font-semibold mt-6 mx-auto text-center mb-3">
                Incoming Logs
              </h2>
              <table className="table table-zebra">
              <thead>
                <tr>
                  <th></th>
                  <th>Contractor ID</th>
                  <th>Time and Date of Collection</th>
                  <th>Collected Waste Amount</th>
                  <th>Collected Waste Type</th>
                  <th>Time of Arrival</th>
                  <th>Vehicles Used</th>
                </tr>
              </thead>
              <tbody>
                    <tr>
                      <th>1</th>
                      <td>A</td>
                      <td>B</td>
                      <td>C</td>
                      <td>D</td>
                      <td>E</td>
                      <td>F</td>
                    </tr>
              </tbody>
              </table>
            </div>

          </>
      )}

      

      {/* Error handling: Displays message if there is an error in fetching logs */}
      {error && (
        <h1 className="text-center text-red-500 font-semibold">
          No Logs Available
        </h1>
      )}
    </div>
  );
};

export default DashboardStat;
