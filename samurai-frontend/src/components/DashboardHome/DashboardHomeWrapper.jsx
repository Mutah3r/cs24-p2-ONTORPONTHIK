import { useEffect, useState } from "react";
import DashboardHome from "./DashboardHome";
import DashboardStat from "./DashboardStat";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import ThirdPartyDashboard from "./ThirdPartyDashboard";

// DashboardHomeWrapper serves as a conditional wrapper component that decides which dashboard view to display based on the user's role.
const DashboardHomeWrapper = () => {
  const [user, setUser] = useState([]); // State to store user data
  const [loading, setLoading] = useState(true); // State to manage the loading status of the user data

  // fetch user data
  useEffect(() => {
    axios
      .get(
        // URL constructed with the user's token retrieved from localStorage
        `http://localhost:8000/profile?token=${JSON.parse(
          localStorage.getItem("user")
        )}`
      )
      .then((res) => {
        setUser(res.data); // Set user data in state
        setLoading(false); // Update loading state to false after data is fetched
      });
  }, []);

  // Conditional rendering based on the loading state and user role
  if (!loading && user) {
    if (user.role === "System admin") {
      return <DashboardHome />; // Render DashboardHome if the user is a system admin
    }
    else if(user.role === "Contractor Manager"){
      return <ThirdPartyDashboard />
    } else {
      return <DashboardStat user={user} />; // Render DashboardStat for other roles, passing user data as a prop
    }
  } else {
    return (
      <div className="flex items-center w-full justify-center py-3">
        <ClipLoader
          color={"#22C55E"}
          loading={true}
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  }
};

export default DashboardHomeWrapper;
