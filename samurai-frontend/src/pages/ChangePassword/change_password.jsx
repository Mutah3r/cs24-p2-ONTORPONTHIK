import Logo from "../../components/Logo/Logo";
import axios from "axios";
import { IoLogIn } from "react-icons/io5";

const Login = () => {
  const signIn = async (event) => {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;

    const response = await axios.post("http://localhost:8000/auth/login", {
      email: email,
      password: password,
    });

    console.log(response.data);

    if (response.data.role === "Unassigned") {
      // logout user because unassigned users cannot login
    } else {
      localStorage.setItem("user", JSON.stringify(response.data));
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
        {/* Old Password Field */}
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
               name="password"
               type="password"
               className="grow"
               placeholder="Old Password"
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
              placeholder="New Password"
            />
          </label>
        </div>
        {/* Change Password Button */}
        <div>
          <button className="w-full justify-center mx-auto mt-3 flex gap-2 items-center bg-green-500 text-white hover:bg-green-700 hover:text-green-500 px-6 py-3 text-xl rounded-md transition-all duration-200">
            Change Password <IoLogIn />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
