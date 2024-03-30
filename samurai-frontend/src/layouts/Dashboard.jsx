import { Link, Outlet, useNavigate } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { LuLayoutDashboard } from "react-icons/lu";
import { FaUserFriends } from "react-icons/fa";
import { FaWarehouse } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { FaTruck } from "react-icons/fa";
import { FaKey } from "react-icons/fa6";
import { GrScheduleNew } from "react-icons/gr";
import { GiMoneyStack } from "react-icons/gi";
import { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [user, setUser] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [roles, setRoles] = useState([]);

  const navigate = useNavigate();

  const adminRoutes = [
    {
      title: "Dashboard",
      icon: LuLayoutDashboard,
      to: "/dashboard",
    },
    {
      title: "User & Role Management",
      icon: FaUserFriends,
      to: "users",
    },
    {
      title: "Roles & Permissions",
      icon: FaKey,
      to: "roles",
    },
    {
      title: "Facility Management",
      icon: FaWarehouse,
      to: "facilities",
    },
    {
      title: "Vehicles Management",
      icon: FaTruck,
      to: "vehicles",
    },
  ];

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("http://localhost:8000/rbac/roles")
      .then((res) => {
        setRoles(res.data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
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
        setIsLoading(false);
      })
      .catch(() => {
        // handle error. probably the user is not logged in or the session has been expired
        setIsLoading(false);
      });
  }, []);

  const handleLogout = () => {
    axios
      .post("http://localhost:8000/auth/logout", {
        token: JSON.parse(localStorage.getItem("user")),
      })
      .then(() => {
        localStorage.removeItem("user");
        navigate("/login");
      })
      .catch(() => {
        localStorage.removeItem("user");
        navigate("/login");
      });
  };

  return (
    <div>
      <div>
        <div className="drawer">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            {/* Page content here */}
            <div className="bg-[#F5F5F5] min-h-[100vh] px-2 py-1">
              <div className="flex justify-between">
                <div className="flex gap-3 items-center">
                  <label
                    htmlFor="my-drawer"
                    className="btn btn-accent drawer-button text-black text-[24px] font-bold"
                  >
                    <RxHamburgerMenu />
                  </label>
                  {!isLoading && user && (
                    <h1 className="text-[24px]">
                      Welcome {user.name?.split(" ")[0]} 👋
                    </h1>
                  )}
                </div>
                <div className="dropdown dropdown-hover dropdown-left">
                  <div tabIndex={0} className="m-1 cursor-pointer">
                    <FaUserCircle className="text-[48px]" />
                  </div>
                  <ul
                    tabIndex={0}
                    className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                  >
                    <li className="flex gap-2 justify-center">
                      <Link to="/dashboard/profile">
                        <FaUser /> <span>Profile</span>
                      </Link>
                    </li>
                    <li
                      onClick={handleLogout}
                      className="flex gap-2 justify-center"
                    >
                      <span>
                        <IoLogOut /> <span>Logout</span>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              <Outlet />
            </div>
          </div>
          <div className="drawer-side">
            <label
              htmlFor="my-drawer"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <ul className="menu p-4 w-80 min-h-full text-white bg-[#016666] text-[16px]">
              {/* Sidebar content here */}
              {user &&
                user.role === "System admin" &&
                adminRoutes.map((route) => {
                  return (
                    <li key={route.to}>
                      <Link className="flex items-center gap-2" to={route.to}>
                        <route.icon /> <span>{route.title}</span>
                      </Link>
                    </li>
                  );
                })}
              {user && user.role !== "System admin" && (
                <>
                  <>
                    {roles &&
                    roles.find((role) => role.name === user.role)?.permissions
                      .DashboardStatistics === true ? (
                      <li>
                        <Link
                          className="flex items-center gap-2"
                          to="/dashboard"
                        >
                          <LuLayoutDashboard /> <span>Dashboard</span>
                        </Link>
                      </li>
                    ) : (
                      ""
                    )}
                  </>
                  <>
                    {roles &&
                    roles.find((role) => role.name === user.role)?.permissions
                      .AddVehicleEntry === true ? (
                      <li>
                        <Link className="flex items-center gap-2" to="/entry">
                          <GrScheduleNew /> <span>Vehicle Entry</span>
                        </Link>
                      </li>
                    ) : (
                      ""
                    )}
                  </>
                  <>
                    {roles &&
                    roles.find((role) => role.name === user.role)?.permissions
                      .billing === true ? (
                      <li>
                        <Link className="flex items-center gap-2" to="/billing">
                          <GiMoneyStack /> <span>Billing</span>
                        </Link>
                      </li>
                    ) : (
                      ""
                    )}
                  </>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
