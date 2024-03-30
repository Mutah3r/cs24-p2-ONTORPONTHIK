import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem("user");
  return isLoggedIn ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
