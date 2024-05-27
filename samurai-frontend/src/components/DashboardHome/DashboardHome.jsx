import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import Swal from "sweetalert2";
import { formatTimeToHumanReadable } from "../../utils/timeUtils";
import STSLogsChart from "./STSLogsChart";
import LandfillLogsChart from "./LandfillLogsChart";

const DashboardHome = () => {
    // State declarations
    const [isLoading, setIsLoading] = useState(true); // State to track overall loading status
    const [logsLoading, setLogsLoading] = useState(true); // State to track logs loading status
    const [user, setUser] = useState(null); // State to store user data
    const [stsLogs, setStsLogs] = useState([]); // State for storing STS logs
    const [filteredStsLogs, setFilteredStsLogs] = useState([]); // State for storing filtered STS logs
    const [landfillLogs, setLandfillLogs] = useState([]); // State for storing landfill logs
    const [filteredLandfillLogs, setFilteredLandfillLogs] = useState([]); // State for storing filtered landfill logs

    const navigate = useNavigate(); // Hook to navigate between routes

    // fetch user data
    useEffect(() => {
        axios
            .get(
                `https://cs24-p2-ontorponthik.onrender.com/profile?token=${JSON.parse(
                    localStorage.getItem("user")
                )}`
            )
            .then((res) => {
                setIsLoading(false);
                setUser(res.data);
            });
    }, []);

    // fetch STS logs
    useEffect(() => {
        setLogsLoading(true);
        axios
            .get(
                `https://cs24-p2-ontorponthik.onrender.com/sts/allsts/${JSON.parse(
                    localStorage.getItem("user")
                )}`
            )
            .then((res) => {
                setStsLogs(res.data.data);
                setFilteredStsLogs(res.data.data);
                setLogsLoading(false);
            })
            .catch(() => {
                setLogsLoading(false);
            });
    }, []);

    // fetch landfill logs
    useEffect(() => {
        setLogsLoading(true);
        axios
            .get(
                `https://cs24-p2-ontorponthik.onrender.com/landfill/alllandentry/${JSON.parse(
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

    // Handler for STS log time range submission
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
            return (
                departureTime >= startTimeMili && departureTime <= endTimeMili
            );
        });

        setFilteredStsLogs(filteredLogs);
    };

    // Handler for landfill log time range submission
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
        }

        const startTimeMili = selectedStartTime.getTime();
        const endTimeMili = selectedEndTime.getTime();

        const filteredLogs = landfillLogs.filter((log) => {
            const departureTime = new Date(log.time_of_departure).getTime();
            return (
                departureTime >= startTimeMili && departureTime <= endTimeMili
            );
        });

        setFilteredLandfillLogs(filteredLogs);
    };

    // Main component
    return (
        <div>
            {/* Display loading spinner if isLoading is true */}
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

            {/* Display dashboard when not loading */}
            {!isLoading && (
                <div className="container mx-auto p-6">
                    <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>

                    {/* Week Summary */}
                    <div className="border-2 rounded-lg my-4 pb-5">
                        <h2 className="text-lg font-semibold mt-6 mx-auto text-center mb-3">
                            Week Summary
                        </h2>
                        <div className="grid gird-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-center">STS Logs Chart</h4>
                                <STSLogsChart logsData={stsLogs} />
                            </div>
                            <div>
                                <h4 className="text-center">
                                    Landfill Logs Chart
                                </h4>
                                <LandfillLogsChart logsData={landfillLogs} />
                            </div>
                        </div>
                    </div>

                    {/* STS Logs Section */}
                    <div className="border-2 rounded-lg my-4 pb-5">
                        <h2 className="text-lg font-semibold mt-6 mx-auto text-center mb-3">
                            STS Logs
                        </h2>

                        {/* Form for selecting time range for STS logs */}
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
                                    <button
                                        type="submit"
                                        className="btn btn-neutral"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Display STS logs */}
                        {!logsLoading && (
                            <div className="overflow-x-auto">
                                <h1 className="text-center text-green-500 font-semibold">
                                    Total Wastes{" "}
                                    <span>
                                        {filteredStsLogs
                                            .reduce(
                                                (total, item) =>
                                                    total +
                                                    item.weight_of_waste,
                                                0
                                            )
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
                                                    <td>{log.sts_name}</td>
                                                    <td>
                                                        {
                                                            log.vehicle_registration
                                                        }
                                                    </td>
                                                    <td>
                                                        {log.weight_of_waste +
                                                            " ton"}
                                                    </td>
                                                    <td>
                                                        {formatTimeToHumanReadable(
                                                            log.time_of_departure
                                                        )}
                                                    </td>
                                                    <td>
                                                        {formatTimeToHumanReadable(
                                                            log.time_of_arrival
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Landfill Logs Section */}
                    <div className="border-2 rounded-lg my-4 pb-5">
                        <h2 className="text-lg font-semibold mt-6 mx-auto text-center mb-3">
                            Landfill Logs
                        </h2>

                        {/* Form for selecting time range for Landfill logs */}
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
                                    <button
                                        type="submit"
                                        className="btn btn-neutral"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Display Landfill logs */}
                        {!logsLoading && (
                            <div className="overflow-x-auto">
                                <h1 className="text-center text-green-500 font-semibold">
                                    Total Wastes{" "}
                                    <span>
                                        {filteredLandfillLogs
                                            .reduce(
                                                (total, item) =>
                                                    total +
                                                    item.weight_of_waste,
                                                0
                                            )
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
                                            filteredLandfillLogs.map(
                                                (log, idx) => (
                                                    <tr key={log._id}>
                                                        <th>{idx + 1}</th>
                                                        <td>{log.name}</td>
                                                        <td>
                                                            {
                                                                log.vehicle_registration
                                                            }
                                                        </td>
                                                        <td>
                                                            {log.weight_of_waste +
                                                                " ton"}
                                                        </td>
                                                        <td>
                                                            {formatTimeToHumanReadable(
                                                                log.time_of_departure
                                                            )}
                                                        </td>
                                                        <td>
                                                            {formatTimeToHumanReadable(
                                                                log.time_of_arrival
                                                            )}
                                                        </td>
                                                    </tr>
                                                )
                                            )}
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
