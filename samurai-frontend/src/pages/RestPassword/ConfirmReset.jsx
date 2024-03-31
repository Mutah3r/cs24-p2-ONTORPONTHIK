import axios from "axios";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const ConfirmReset = () => {
  let { token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleConfirm = (result) => {
    if (result.isConfirmed) {
      const newPassword = result.value;
      console.log("New Password:", newPassword);
      setLoading(true);

      if (newPassword.length < 4) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Password must be at least 4 characters long!",
        });
        setLoading(false);
        return;
      }

      axios
        .post("http://localhost:8000/auth/reset-password/confirm", {
          token,
          newPassword,
        })
        .then((res) => {
          console.log(res);
          setLoading(false);
          if (res.data?.message === "Password reset successfully") {
            Swal.fire({
              position: "top-start",
              icon: "success",
              title: "Password reset successful!",
              showConfirmButton: false,
              timer: 1500,
            });
          } else {
            Swal.fire({
              position: "top-start",
              icon: "error",
              title: "Something went wrong!",
              showConfirmButton: false,
              timer: 1500,
            });
          }
          navigate("/login");
        })
        .catch((error) => {
          setLoading(false);
          if (error.response?.data?.message === "Invalid or expired token") {
            Swal.fire({
              position: "top-start",
              icon: "error",
              title: "Reset time expired. Please try again.",
              showConfirmButton: false,
              timer: 1500,
            });
          } else {
            Swal.fire({
              position: "top-start",
              icon: "error",
              title: "Something went wrong!",
              showConfirmButton: false,
              timer: 1500,
            });
          }
          navigate("/login");
        });
    }
  };

  const handleShowAlert = () => {
    Swal.fire({
      title: "Enter New Password",
      input: "password",
      inputPlaceholder: "New Password",
      inputAttributes: {
        autocapitalize: "off",
      },
      confirmButtonText: "OK",
      showCancelButton: true,
      cancelButtonText: "Cancel",
    }).then(handleConfirm);
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <button
        disabled={loading}
        className="btn btn-neutral"
        onClick={handleShowAlert}
      >
        {loading ? "Loading..." : "Enter New Password"}
      </button>
    </div>
  );
};

export default ConfirmReset;
