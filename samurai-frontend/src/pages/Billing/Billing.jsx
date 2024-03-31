import axios from "axios";
import { useEffect, useState } from "react";
import { FaDownload } from "react-icons/fa6";

const Billing = () => {
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(true);
  const [landfillLogs, setLandfillLogs] = useState(null);
  const [filteredLandfillLogs, setFilteredLandfillLogs] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios
      .get(
        `http://localhost:8000/profile?token=${JSON.parse(
          localStorage.getItem("user")
        )}`
      )
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    axios
      .get(
        `http://localhost:8000/landfill/lentry/${JSON.parse(
          localStorage.getItem("user")
        )}`
      )
      .then((res) => {
        console.log("landfill Logs:");
        console.log(res.data.data);

        setLandfillLogs(res.data.data);
        setFilteredLandfillLogs(res.data.data);
        setLoading(false);
        setLogsLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Billing</h1>

      {user && user.role === "Landfill manager" && (
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th></th>
                <th>Ward No.</th>
                <th>Vehicle Reg. No.</th>
                <th>Carried Waste</th>
                <th>Cost Per KM</th>
                <th>Time of Departure</th>
                <th>Time of Arrival</th>
                <th>Destination Landfill</th>
                <th>Download Bill</th>
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
                    <td>{" BDT"}</td>
                    <td>{formatTimeToHumanReadable(log.time_of_departure)}</td>
                    <td>{formatTimeToHumanReadable(log.time_of_arrival)}</td>
                    <td>{log.from}</td>
                    <td className="flex justify-center">
                      <FaDownload className="cursor-pointer text-[20px]" />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Billing;
