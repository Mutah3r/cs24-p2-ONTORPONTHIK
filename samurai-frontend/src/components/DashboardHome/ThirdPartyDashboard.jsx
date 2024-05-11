import axios from "axios";
import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { formatTimeToHumanReadable } from "../../utils/timeUtils";
import ThirdPartyChart from "./ThirdPartyChart";

const ThirdPartyDashboard = () => {
  const [logs, setLogs] = useState([]);
  const [refetch, setRefetch] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastWeekData, setLastWeekData] = useState([]);
  const [company, setCompany] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8000/thirdparties/getcompanyname/${JSON.parse(localStorage.getItem('user'))}`)
    .then(res => {
      setCompany(res.data);
    })
  },[])

  useEffect(() => {
    setIsLoading(true);

    axios
      .get(
        `http://localhost:8000/thirdparties/getemployeelogs/${JSON.parse(
          localStorage.getItem("user")
        )}?is_today=false`
      )
      .then((res) => {
        setLogs(res.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }, [refetch]);

  useEffect(() => {
    axios
      .get(
        `http://localhost:8000/thirdparties/getemployeelogsforlast/${JSON.parse(
          localStorage.getItem("user")
        )}`
      )
      .then((res) => {
        setLastWeekData(res?.data?.totalsSeparatedByDay);
      });
  }, []);

  const handleTodaysLogs = () => {
    setIsLoading(true);

    axios
      .get(
        `http://localhost:8000/thirdparties/getemployeelogs/${JSON.parse(
          localStorage.getItem("user")
        )}?is_today=true`
      )
      .then((res) => {
        setLogs(res.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4 text-center">
        Third-Party Contractor Dashboard
      </h1>

      <div>
        <h3>Company Name: {company?.name_of_the_company || ""}</h3>
        <h3>Designated STS Ward: {company?.designated_sts || ""}</h3>
      </div>

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
        <>
          <div className="overflow-x-auto mb-6">
            <h1 className="text-center font-semibold my-6">Last Week Summary</h1>
            <ThirdPartyChart latestData={lastWeekData} />
          </div>
        </>
      )}

      {/* employee logs */}
      {!isLoading && (
        <div className="overflow-x-auto">
          <h1 className="text-center font-semibold my-6">Employee Logs</h1>
          <div className="flex justify-between items-center my-3">
            <div className="flex flex-col gap-1 text-green-500 font-semibold">
              <span>Total Payment: {logs?.summary?.totalPayment} BDT</span>
              <span>
                Total Waste:{" "}
                {parseFloat(logs?.summary?.totalWasteCarriedTons) * 1000} kg
              </span>
            </div>
            <button
              onClick={handleTodaysLogs}
              className="btn btn-active btn-neutral"
            >
              Show Todays Logs
            </button>
          </div>
          <table className="table table-zebra my-4">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Login Time</th>
                <th>Logout Time</th>
                <th>Total Hours Worked</th>
                <th>Total Waste Carried</th>
                <th>Total Payment</th>
              </tr>
            </thead>
            <tbody>
              {logs &&
                logs.logs.map((log, idx) => (
                  <tr key={log._id}>
                    <th>{idx + 1}</th>
                    <td>{log.full_name}</td>
                    <td>{formatTimeToHumanReadable(log.log_in_time)}</td>
                    <td>{formatTimeToHumanReadable(log.log_out_time)}</td>
                    <td>{log.total_hours_worked}</td>
                    <td>{parseFloat(log.waste_carried) * 1000} kg</td>
                    <td>{log.total_payment} BDT</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* outgoing logs */}
      {!isLoading && (
        <div className="overflow-x-auto">
          <h1 className="text-center font-semibold my-6">Outgoing Logs</h1>

          <div className="flex justify-between items-center my-3">
            <div className="flex flex-col gap-1 text-green-500 font-semibold">
              <span>Total Payment: {logs?.summary?.totalPayment} BDT</span>
              <span>
                Total Waste:{" "}
                {parseFloat(logs?.summary?.totalWasteCarriedTons) * 1000} kg
              </span>
            </div>
          </div>
          
          <table className="table table-zebra my-4">
            <thead>
              <tr>
                <th></th>
                <th>Date</th>
                <th>Waste Amount</th>
                <th>Vehicles Used</th>
                <th>Fine</th>
                <th>Total Bill Received</th>
              </tr>
            </thead>
            <tbody>
              {logs &&
                logs.logs.map((log, idx) => (
                  <tr key={log._id}>
                    <th>{idx + 1}</th>
                    <td>{log.full_name}</td>
                    <td>{formatTimeToHumanReadable(log.log_in_time)}</td>
                    <td>{log.total_hours_worked}</td>
                    <td>{parseFloat(log.waste_carried) * 1000} kg</td>
                    <td>{log.total_payment} BDT</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ThirdPartyDashboard;
