import axios from "axios";

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  (config) => {
    // Intercept request before it is sent
    const token = JSON.parse(localStorage.getItem("user"));
    if (!token) {
      logoutUser();
      return Promise.reject("User token not found");
    }

    // if token is found than chk if it exists on the database
    axios
      .post(`http://localhost:8000/profile/isLogin`, {
        token: token,
      })
      .then((res) => {
        if (!res.data?.isLogin) {
          logoutUser();
          return Promise.reject({ error: "User not logged in" });
        } else {
          return config;
        }
      })
      .catch(() => {
        return Promise.reject({ error: "User not logged in" });
      });
  },
  (error) => {
    logoutUser();
    return Promise.reject(error);
  }
);

// Function to logout user
function logoutUser() {
  localStorage.removeItem("user");
  window.location = "/login";
}

export default axiosInstance;
