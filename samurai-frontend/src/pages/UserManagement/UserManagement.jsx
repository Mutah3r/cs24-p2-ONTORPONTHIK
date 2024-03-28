import axios from "axios";
import { MdEdit } from "react-icons/md";
import { useEffect, useState } from "react";
import { MdDeleteForever } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([
    "Unassigned",
    "System admin",
    "STS manager",
    "Landfill manager",
  ]);

  useEffect(() => {
    axios.get("http://localhost:8000/users").then((res) => {
      console.log(res.data);
      setUsers(res.data);
    });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8000/rbac/roles")
      .then((res) => setRoles(res.data.roles));
  }, []);

  const handleUserEdit = (userId) => {
    alert("edit user " + userId);
  };

  const handleUserDelete = (userId) => {
    alert("delete user " + userId);
  };

  const throwErrorPopup = (errorMsg) => {
    Swal.fire({
      title: "Error",
      text: errorMsg,
      icon: "error",
    });
  };

  const handleAddNewUser = () => {
    const newName = document.getElementById("swal-input-name").value;
    const newEmail = document.getElementById("swal-input-email").value;
    const newPassword = document.getElementById("swal-input-password").value;
    const newRole = document.getElementById("swal-select-role").value;

    // Validate input fields
    if (!newName || !newEmail || !newPassword || !newRole) {
      throwErrorPopup("Please fill out all required fields");
      return;
    }

    // validate name
    if (newName.length < 2) {
      throwErrorPopup("Please Enter a valid name");
      return;
    }

    // validate email
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!emailRegex.test(newEmail)) {
      throwErrorPopup("Please enter a valid email");
      return;
    }

    // validate password
    if (newPassword.length < 6) {
      throwErrorPopup("Password must be atleast 6 characters long");
      return;
    }

    // Handle submission
    console.log("Submitting data:", {
      newName,
      newEmail,
      newPassword,
      newRole,
    });

    // refetch users

    // Close the popup
    Swal.close();
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">User Management</h1>

      <button
        onClick={() =>
          Swal.fire({
            title: "Add User",
            html:
              `<input type="text" id="swal-input-name" placeholder="Name"  class="swal2-input" required>` +
              `<input type="email" id="swal-input-email" placeholder="Email"  class="swal2-input" required>` +
              `<input type="password" id="swal-input-password" placeholder="Password"  class="swal2-input" required>` +
              `<select id="swal-select-role" class="swal2-select" required>${roles
                .map((role) => `<option value="${role}">${role}</option>`)
                .join("")}</select>`,
            showCancelButton: true,
            confirmButtonText: "Add",
            cancelButtonText: "Cancel",
            preConfirm: () => {
              handleAddNewUser();
            },
          })
        }
        className="mt-3 flex gap-2 items-center bg-green-500 text-white hover:bg-white hover:text-green-500 px-4 py-2 text-md rounded-md transition-all duration-200"
      >
        <FaPlus /> Add New User
      </button>

      <h2 className="text-lg font-semibold mt-6 mx-auto text-center mb-3">
        All User Information
      </h2>
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {/* rows */}
            {users.map((user, idx) => (
              <tr key={user._id}>
                <th>{idx + 1}</th>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td className="flex gap-2 items-center">
                  <button
                    onClick={() => handleUserEdit(user._id)}
                    className="p-1 flex gap-2 items-center bg-green-500 text-white hover:bg-white hover:text-green-500 text-xl rounded-md transition-all duration-200"
                  >
                    <MdEdit className="text-[20px]" />
                  </button>
                  <button
                    onClick={() => handleUserDelete(user._id)}
                    className="p-1 flex gap-2 items-center bg-red-500 text-white hover:bg-red-200 hover:text-red-500 text-xl rounded-md transition-all duration-200"
                  >
                    <MdDeleteForever className="text-[20px]" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
