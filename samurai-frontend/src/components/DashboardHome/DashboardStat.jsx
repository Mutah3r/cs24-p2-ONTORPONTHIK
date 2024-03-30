import axios from "axios";
import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";

const DashboardStat = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [stsLogs, setStsLogs] = useState([]);
  const [landfillLogs, setLandfillLogs] = useState([]);

  useEffect(() => {
    if (user.role === "STS manager") {
      axios
        .get(
          `http://localhost:8000/facilities/sts/${JSON.parse(
            localStorage.getItem("user")
          )}`
        )
        .then((res) => {
          console.log(res.data);
          setLandfillLogs(res.data);
        });
    } else if (user.role === "Landfill manager") {
    } else {
    }
  }, []);

  console.log(user);
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>

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
    </div>
  );
};

export default DashboardStat;
