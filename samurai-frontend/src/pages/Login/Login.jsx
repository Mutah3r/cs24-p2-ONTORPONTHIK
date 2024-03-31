import Logo from "../../components/Logo/Logo";
import axios from "axios";
import { useState } from "react";
import { IoLogIn } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import ClipLoader from "react-spinners/ClipLoader";
import Swal from "sweetalert2";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  const navigate = useNavigate();

  const handleCaptcha = (value) => {
    if (value) {
      setIsCaptchaVerified(true);
    } else {
      setIsCaptchaVerified(true);
    }
  };

  const signIn = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    if (!isCaptchaVerified) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Captcha is not verified!",
      });
      setIsLoading(false);
      return;
    }

    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      const response = await axios.post("http://localhost:8000/auth/login", {
        email: email,
        password: password,
      });

      if (response?.data?.role === "Unassigned") {
        localStorage.removeItem("user");
        setIsLoading(false);
      } else {
        localStorage.setItem("user", JSON.stringify(response.data.token));
        setIsLoading(false);

        if (response?.data?.isFirstTime === false) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Please change your password after first login",
            showConfirmButton: false,
            timer: 1500,
          });
          navigate("/dashboard/profile");
        } else {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Welcome Back",
            showConfirmButton: false,
            timer: 1500,
          });
          navigate("/dashboard");
        }
      }
    } catch (error) {
      setIsLoading(false);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Email or password is incorrect!",
      });
      return;
    }
  };
  return (
    <div className="min-h-[100vh] min-w-[100vw] bg-gradient-to-b from-green-400 to-green-700 flex items-center">
      <form
        onSubmit={signIn}
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
        {/* Password Field */}
        <div>
          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clipRule="evenodd"
              />
            </svg>

            <input
              name="password"
              type="password"
              className="grow"
              placeholder="Password"
            />
          </label>
        </div>
        {/* Captcha */}
        <div>
          <ReCAPTCHA
            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
            onChange={handleCaptcha}
          />
        </div>
        {/* Forgot Password */}
        <div className="flex justify-center">
          <Link
            to="/forgot-password"
            className="text-green-500 hover:text-green-700 underline"
          >
            Forgot Password
          </Link>
        </div>
        {/* Login Button */}
        <div>
          <button
            disabled={isLoading || !isCaptchaVerified}
            className={`${
              isLoading || !isCaptchaVerified
                ? "bg-gray-400 cursor-not-allowed hover:bg-gray-400 hover:text-white"
                : ""
            } w-full justify-center mx-auto mt-3 flex gap-2 items-center bg-green-500 text-white hover:bg-green-700 hover:text-green-500 px-6 py-3 text-xl rounded-md transition-all duration-200`}
          >
            {!isLoading && (
              <>
                Login <IoLogIn />
              </>
            )}
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

export default Login;
