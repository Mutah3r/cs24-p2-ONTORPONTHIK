import { useEffect, useState } from "react";
import DashboardHome from "./DashboardHome";
import DashboardStat from "./DashboardStat";
import axios from "axios";

const DashboardHomeWrapper = () => {
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (!loading && user) {
    if (user.role === "System admin") {
      return <DashboardHome />;
    } else {
      return <DashboardStat user={user} />;
    }
  } else {
    return <>Loading...</>;
  }
};

export default DashboardHomeWrapper;
