import axios from "axios";
import { useEffect, useState } from "react";
import { FaDownload } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { formatTimeToHumanReadable } from "../../utils/timeUtils";
import { createAndDownloadPDF } from "../../utils/pdfUtils";

const Billing = () => {
  // State hooks for user data, loading states, logs, and error handling
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(true);
  const [landfillLogs, setLandfillLogs] = useState(null);
  const [filteredLandfillLogs, setFilteredLandfillLogs] = useState([]);
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  // fetch user profile
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

  // fetch landfill logs for billing
  useEffect(() => {
    axios
      .get(
        `http://localhost:8000/billing/billslip/${JSON.parse(
          localStorage.getItem("user")
        )}`
      )
      .then((res) => {
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


  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Billing</h1>

      {/* Display the billing table if user is a landfill manager and logs are loaded */}
      {user && user.role === "Landfill manager" && (
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th></th>
                <th>Landfill Name</th>
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
                    <td>{log.cost_per_km + " BDT"}</td>
                    <td>{formatTimeToHumanReadable(log.time_of_departure)}</td>
                    <td>{formatTimeToHumanReadable(log.time_of_arrival)}</td>
                    <td>{log.from}</td>
                    <td className="flex justify-center">
                      {/* Download icon with onClick event to trigger PDF creation */}
                      <FaDownload
                        onClick={() => createAndDownloadPDF(log)}
                        className="cursor-pointer text-[20px]"
                      />
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
