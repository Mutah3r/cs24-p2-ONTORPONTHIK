import axios from "axios";
import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import Swal from "sweetalert2";

const DashboardHome = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [stsLogs, setStsLogs] = useState([]);
  const [filteredStsLogs, setFilteredStsLogs] = useState([]);
  const [landfillLogs, setLandfillLogs] = useState([]);
  const [filteredLandfillLogs, setFilteredLandfillLogs] = useState([]);

  useEffect(() => {
    axios
      .get(
        `http://localhost:8000/profile?token=${JSON.parse(
          localStorage.getItem("user")
        )}`
      )
      .then((res) => {
        setIsLoading(false);
        setUser(res.data);
      });
  }, []);

  useEffect(() => {
    setLogsLoading(true);
    axios
      .get(
        `http://localhost:8000/sts/allsts/${JSON.parse(
          localStorage.getItem("user")
        )}`
      )
      .then((res) => {
        setStsLogs(res.data.data);
        console.log(res.data.data);
        setFilteredStsLogs(res.data.data);
        setLogsLoading(false);
      })
      .catch(() => {
        setLogsLoading(false);
      });
  }, []);

  useEffect(() => {
    setLogsLoading(true);
    axios
      .get(
        `http://localhost:8000/facilities/allland/${JSON.parse(
          localStorage.getItem("user")
        )}`
      )
      .then((res) => {
        setLandfillLogs(res.data.data);
        setFilteredLandfillLogs(res.data.data);
        setLogsLoading(false);
      })
      .catch(() => {
        setLogsLoading(false);
      });
  }, []);

  const formatTimeToHumanReadable = (timeString) => {
    const date = new Date(timeString);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };

    return date.toLocaleDateString(undefined, options);
  };

  const handleTimeSubmitSTS = (event) => {
    event.preventDefault();
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
      console.log({ startTimeMili, departureTime, endTimeMili });
      return departureTime >= startTimeMili && departureTime <= endTimeMili;
    });

    setFilteredStsLogs(filteredLogs);
    console.log(filteredLogs);
  };

  const handleTimeSubmitLandfill = (event) => {
    event.preventDefault();
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
    } else {
      console.log("Selected Start Time:", selectedStartTime);
      console.log("Selected End Time:", selectedEndTime);
    }

    const startTimeMili = selectedStartTime.getTime();
    const endTimeMili = selectedEndTime.getTime();

    const filteredLogs = landfillLogs.filter((log) => {
      const departureTime = new Date(log.time_of_departure).getTime();
      console.log({ startTimeMili, departureTime, endTimeMili });
      return departureTime >= startTimeMili && departureTime <= endTimeMili;
    });

    setFilteredLandfillLogs(filteredLogs);
    console.log(filteredLogs);
  };

  return (
    <div>
      {isLoading && (
        <div className="flex items-center w-full justify-center py-3">
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
        <div className="container mx-auto p-6">
          <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>

          <div className="border-2 rounded-lg my-4 pb-5">
            <h2 className="text-lg font-semibold mt-6 mx-auto text-center mb-3">
              STS Logs
            </h2>

            <div className="mt-5">
              <form
                onSubmit={handleTimeSubmitSTS}
                className="px-8 pt-6 pb-8 mb-4"
              >
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
                  <button type="submit" className="btn btn-neutral">
                    Submit
                  </button>
                </div>
              </form>
            </div>

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
                      <th>Time of Departure</th>
                      <th>Time of Arrival</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStsLogs &&
                      filteredStsLogs.map((log, idx) => (
                        <tr key={log._id}>
                          <th>{idx + 1}</th>
                          <td>{"N/A"}</td>
                          <td>{log.vehicle_registration}</td>
                          <td>{log.weight_of_waste + " ton"}</td>
                          <td>
                            {formatTimeToHumanReadable(log.time_of_departure)}
                          </td>
                          <td>
                            {formatTimeToHumanReadable(log.time_of_arrival)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="border-2 rounded-lg my-4 pb-5">
            <h2 className="text-lg font-semibold mt-6 mx-auto text-center mb-3">
              Landfill Logs
            </h2>

            <div className="mt-5">
              <form
                onSubmit={handleTimeSubmitLandfill}
                className="px-8 pt-6 pb-8 mb-4"
              >
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
                  <button type="submit" className="btn btn-neutral">
                    Submit
                  </button>
                </div>
              </form>
            </div>

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
                      <th>Landfill Name</th>
                      <th>Vehicle Reg. No.</th>
                      <th>Carried Waste</th>
                      <th>Time of Departure</th>
                      <th>Time of Arrival</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLandfillLogs &&
                      filteredLandfillLogs.map((log, idx) => (
                        <tr key={log._id}>
                          <th>{idx + 1}</th>
                          <td>N/A</td>
                          <td>{log.vehicle_registration}</td>
                          <td>{log.weight_of_waste + " ton"}</td>
                          <td>
                            {formatTimeToHumanReadable(log.time_of_departure)}
                          </td>
                          <td>
                            {formatTimeToHumanReadable(log.time_of_arrival)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
