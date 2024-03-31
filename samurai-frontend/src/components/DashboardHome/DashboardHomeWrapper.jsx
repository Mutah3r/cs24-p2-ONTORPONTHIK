import { useEffect, useState } from "react";
import DashboardHome from "./DashboardHome";
import DashboardStat from "./DashboardStat";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const DashboardHomeWrapper = () => {
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .post("http://localhost:8000/profile/isLogin", {
        token: JSON.parse(localStorage.getItem("user")),
      })
      .then((r) => {
        if (r.data?.isLogin === false) {
          localStorage.removeItem("user");
          navigate("/login");
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Your session has expired",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      })
      .catch(() => {
        console.log("session check error");
      });
  }, []);

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
