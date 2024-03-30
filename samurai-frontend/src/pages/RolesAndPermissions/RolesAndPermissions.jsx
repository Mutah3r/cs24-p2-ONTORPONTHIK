import axios from "axios";
import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import Swal from "sweetalert2";

const RolesAndPermissions = () => {
  const [refetch, setRefetch] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/rbac/roles").then((res) => {
      // const names = res.data.map((item) => item.name);
      console.log(res.data);
      setRoles(res.data);
      setIsLoading(false);
    });
  }, [refetch]);

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
        console.log("New Role:", result.value);
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
        <button className="btn btn-wide btn-outline grow">
          Add New Permission
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
