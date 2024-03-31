import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import Swal from "sweetalert2";

const RolesAndPermissions = () => {
  const [refetch, setRefetch] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [roles, setRoles] = useState([]);

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
    axios.get("http://localhost:8000/rbac/roles").then((res) => {
      setRoles(res.data);
      setIsLoading(false);
    });
  }, [refetch]);

  const handleAssignRole = () => {
    Swal.fire({
      title: "Select Role and Permissions",
      html: `
        <select id="role" class="swal2-select">
          ${roles.map(
            (role) => `<option value="${role.name}">${role.name}</option>`
          )}
        </select>
        <div>
          <br />
          <input id="dashboard" type="checkbox" checked>
          <label for="dashboard">Dashboard Statistics</label>
          <br />
          <input id="vehicleEntry" type="checkbox" checked>
          <label for="vehicleEntry">Add Vehicle Entry</label>
          <br />
          <input id="billing" type="checkbox" checked>
          <label for="billing">Billing</label>
        </div>
      `,
      showCancelButton: true,
      focusConfirm: false,
      preConfirm: () => {
        const role = document.getElementById("role").value;
        const dashboard = document.getElementById("dashboard").checked;
        const vehicleEntry = document.getElementById("vehicleEntry").checked;
        const billing = document.getElementById("billing").checked;

        return {
          role,
          permissions: {
            DashboardStatistics: dashboard,
            AddVehicleEntry: vehicleEntry,
            billing,
          },
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        //
        setIsLoading(true);
        axios
          .post("http://localhost:8000/rbac/permissions", {
            name: result.value.role,
            permissions: result.value.permissions,
            token: JSON.parse(localStorage.getItem("user")),
          })
          .then((res) => {
            setIsLoading(false);
            if (res.data?.message === "Permissions updated successfully") {
              Swal.fire({
                title: "Good job!",
                text:
                  "Permissions assigned to " +
                  result.value.role +
                  " successfully!",
                icon: "success",
              });
              setRefetch(!refetch);
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
      }
    });
  };

  const handleAddNewRole = () => {
    setIsLoading(true);
    Swal.fire({
      title: "Enter New Role",
      html: '<input id="swal-input1" class="swal2-input">',
      showCancelButton: true,
      focusConfirm: false,
      preConfirm: () => {
        return document.getElementById("swal-input1").value;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post("http://localhost:8000/rbac/roles", {
            name: result.value,
            token: JSON.parse(localStorage.getItem("user")),
          })
          .then((res) => {
            setIsLoading(false);
            if (res.data?.message === "Role created successfully") {
              Swal.fire({
                title: "Good job!",
                text: "New role created!",
                icon: "success",
              });
              setRefetch(!refetch);
            } else {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
              });
            }
          })
          .catch((error) => {
            setIsLoading(false);
            if (error.response?.data?.message === "Allready added") {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Role already exists.",
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
              });
            }
          });
      } else {
        setIsLoading(false);
      }
    });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">
        Roles & Permissions Management
      </h1>
      <div className="flex gap-3">
        <button
          onClick={handleAddNewRole}
          className="btn btn-wide btn-outline grow"
        >
          Add New Role
        </button>
        <button
          onClick={handleAssignRole}
          className="btn btn-wide btn-outline grow"
        >
          Assign Permission
        </button>
      </div>

      <h2 className="text-lg font-semibold mt-6 mx-auto text-center mb-3">
        Available Roles
      </h2>

      {isLoading && (
        <div className="mx-auto flex justify-center items-center py-5">
          <ClipLoader
            color={"#22C55E"}
            loading={isLoading}
            size={50}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )}

      {!isLoading && (
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Permissions</th>
              </tr>
            </thead>
            <tbody>
              {roles &&
                roles.map((role, idx) => (
                  <tr key={role.name}>
                    <th>{idx + 1}</th>
                    <td>{role.name}</td>
                    <td className="flex flex-col gap-2 justify-center">
                      {Object.keys(role.permissions).map((key) => (
                        <span
                          key={key}
                        >{`${key}: ${role.permissions[key]}`}</span>
                      ))}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RolesAndPermissions;
