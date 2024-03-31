import ClipLoader from "react-spinners/ClipLoader";
import Logo from "../../components/Logo/Logo";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePass = (event) => {
    event.preventDefault();
    setIsLoading(true);

    console.log(event.target.email.value);
    axios
      .post("http://localhost:8000/auth/reset-password/initiate", {
        email: event.target.email.value,
      })
      .then((res) => {
        setIsLoading(false);
        if (
          res.data?.message ===
          "Password reset initiated. Check your email for further instructions."
        ) {
          event.target.email.value = "";
          Swal.fire({
            title: "Please check your email for further instruction!",
            showClass: {
              popup: `
              animate__animated
              animate__fadeInUp
              animate__faster
            `,
            },
            hideClass: {
              popup: `
              animate__animated
              animate__fadeOutDown
              animate__faster
            `,
            },
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          });
        }
      })
      .catch(() => {
        setIsLoading(false);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      });
  };

  return (
    <div className="min-h-[100vh] min-w-[100vw] bg-gradient-to-b from-green-400 to-green-700 flex items-center">
      <form
        onSubmit={handleChangePass}
        className="bg-white max-w-xl mx-auto p-4 rounded-md flex gap-4 flex-col"
      >
        {/* Logo */}
        <div className="flex justify-center">
          <Logo bgWhite={true} />
        </div>
        {/* Email Field */}
        <div>
          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
              <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
            </svg>
            <input
              name="email"
              type="email"
              className="grow"
              placeholder="Email"
            />
          </label>
        </div>

        {/* Submit Button */}
        <div>
          <button
            disabled={isLoading}
            className={`${
              isLoading
                ? "bg-gray-400 cursor-not-allowed hover:bg-gray-400 hover:text-white"
                : ""
            } w-full justify-center mx-auto mt-3 flex gap-2 items-center bg-green-500 text-white hover:bg-green-700 hover:text-green-500 px-6 py-3 text-xl rounded-md transition-all duration-200`}
          >
            {!isLoading && <>Submit</>}
            {
              <ClipLoader
                color={"#FFF"}
                loading={isLoading}
                size={30}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
