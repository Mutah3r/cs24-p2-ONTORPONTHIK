import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Dashboard from "../layouts/Dashboard";
import Profile from "../pages/Profile/Profile";
import UserManagement from "../pages/UserManagement/UserManagement";
import FacilityManagement from "../pages/FacilityManagement/FacilityManagement";
import VehicleManagement from "../pages/VehicleManagement/VehicleManagement";
import RolesAndPermissions from "../pages/RolesAndPermissions/RolesAndPermissions";
import PrivateRoute from "./PrivateRoute";
import DashboardHomeWrapper from "../components/DashboardHome/DashboardHomeWrapper";
import VehicleEntry from "../pages/VehicleEntry/VehicleEntry";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
    children: [
      {
        path: "",
        element: <DashboardHomeWrapper />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "users",
        element: <UserManagement />,
      },
      {
        path: "facilities",
        element: <FacilityManagement />,
      },
      {
        path: "vehicles",
        element: <VehicleManagement />,
      },
      {
        path: "roles",
        element: <RolesAndPermissions />,
      },
      {
        path: "entry",
        element: <VehicleEntry />,
      },
    ],
  },
]);

export default router;
