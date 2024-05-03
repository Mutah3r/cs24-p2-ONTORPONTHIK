import { useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const useSessionCheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8000/profile/isLogin",
          {
            token: JSON.parse(localStorage.getItem("user")),
          }
        );
        if (response.data?.isLogin === false) {
          localStorage.removeItem("user");
          navigate("/login");
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Your session has expired!",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } catch (error) {
        console.log("Session check error:", error);
      }
    };

    checkSession();
  }, []);
};

export default useSessionCheck;
