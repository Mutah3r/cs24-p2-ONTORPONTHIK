import axios from "axios";
import { MdEdit } from "react-icons/md";
import { useEffect, useState } from "react";
import { MdDeleteForever } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import Swal from "sweetalert2";
import ClipLoader from "react-spinners/ClipLoader";

const UserManagement = () => {
  const [refetch, setRefetch] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/users/roles").then((response) => {
      const rolesArray = response.data.map((item) => item.name);
      setRoles(rolesArray);
    });
  }, []);

  useEffect(() => {
    axios.get("http://localhost:8000/users").then((res) => {
      console.log(res.data);
      setUsers(res.data);
      setIsLoading(false);
    });
  }, [refetch]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/rbac/roles")
      .then((res) => setRoles(res.data.roles));
  }, []);

  const handleUpdateRole = async (previousRole) => {
    const inputOptions = {};

    roles.forEach((name) => {
      inputOptions[name] = name;
    });

    const { value: role } = await Swal.fire({
      title: "Set Role",
      input: "select",
      inputOptions: inputOptions,
      inputValue: previousRole,
      inputPlaceholder: "Select a role",
      showCancelButton: true,
      inputValidator: (value) => {
        return new Promise((resolve) => {
          if (value !== "") {
            resolve();
          } else {
            resolve("You need to select a role");
          }
        });
      },
    });

    if (role) {
      // Handle the selected role here and make an API call
      console.log("Selected role:", role);
    }
  };

  window.togglePasswordInput = (checkbox) => {
    const passwordDiv = document.getElementById("passwordDiv");
    if (checkbox.checked) {
      passwordDiv.style.display = "block";
    } else {
      passwordDiv.style.display = "none";
    }
  };

  const handleUserEdit = (userId, role) => {
    setIsLoading(true);

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // change user info
    axios
      .put(`http://localhost:8000/users/${userId}`, {
        name,
        email,
        password: password || null,
        role,
        token: JSON.parse(localStorage.getItem("user")),
      })
      .then((response) => {
        if (response.data?.message === "User updated successfully") {
          Swal.fire({
            title: "Success!",
            text: "User information has been updated!",
            icon: "success",
          });
          // refetch users
          setRefetch(!refetch);
          setIsLoading(false);
        } else {
          throwErrorPopup("User information was not updated!");
          setIsLoading(false);
        }
      })
      .catch(() => {
        throwErrorPopup("User information was not updated!");
        setIsLoading(false);
      });
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
    setIsLoading(true);

    const newName = document.getElementById("swal-input-name").value;
    const newEmail = document.getElementById("swal-input-email").value;
    const newPassword = document.getElementById("swal-input-password").value;
    const newRole = document.getElementById("swal-select-role").value;

    // Validate input fields
    if (!newName || !newEmail || !newPassword || !newRole) {
      throwErrorPopup("Please fill out all required fields");
      setIsLoading(false);
      return;
    }

    // validate name
    if (newName.length < 2) {
      throwErrorPopup("Please Enter a valid name");
      setIsLoading(false);
      return;
    }

    // validate email
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!emailRegex.test(newEmail)) {
      throwErrorPopup("Please enter a valid email");
      setIsLoading(false);
      return;
    }

    // validate password
    if (newPassword.length < 4) {
      throwErrorPopup("Password must be atleast 4 characters long");
      setIsLoading(false);
      return;
    }

    // Handle submission
    console.log("Submitting data:", {
      newName,
      newEmail,
      newPassword,
      newRole,
    });

    axios
      .post("http://localhost:8000/users", {
        name: newName,
        email: newEmail,
        password: newPassword,
        role: newRole,
        token: JSON.parse(localStorage.getItem("user")),
      })
      .then((res) => {
        console.log(res.data);
        if (res.data?.message === "Registration successful") {
          Swal.fire({
            title: "Success!",
            text: "New user created!",
            icon: "success",
          });

          //   refetch all users
          setRefetch(!refetch);
          setIsLoading(false);
        } else {
          throwErrorPopup("Unable to create new user!");
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
        if (error?.response?.data?.message === "Email already exists") {
          throwErrorPopup("Email already exist!");
          setIsLoading(false);
          return;
        }

        throwErrorPopup("Error occurred! Please try again later.");
        setIsLoading(false);
      });

    // Close the popup
    Swal.close();
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">User Management</h1>

      <button
        disabled={isLoading}
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
      {isLoading && (
        <div className="flex items-center w-full justify-center py-3">
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
                  <td>
                    <div className="flex items-center gap-2">
                      <span>{user.role}</span>{" "}
                      <IoMdSettings
                        onClick={() => handleUpdateRole(user.role)}
                        className="text-green-500 text-lg cursor-pointer hover:animate-spin"
                      />
                    </div>
                  </td>
                  <td className="flex gap-2 items-center">
                    <button
                      onClick={() =>
                        Swal.fire({
                          title: "Enter User Information",
                          html:
                            `<input id="name" class="swal2-input" value="${user.name}" placeholder="Name">` +
                            `<input id="email" class="swal2-input" value="${user.email}" placeholder="Email">` +
                            `<div id="passwordDiv" style="text-align:center; margin-top:10px; display:none;">
                                <input id="password" type="password" class="swal2-input" placeholder="Password">
                            </div>` +
                            `<br><input id="passwordCheckbox" style="margin-top:16px" type="checkbox" class="swal2-checkbox" onclick="togglePasswordInput(this)"> Update Password`,
                          showCancelButton: true,
                          confirmButtonText: "Update",
                          cancelButtonText: "Cancel",
                          preConfirm: () => {
                            handleUserEdit(user._id, user.role);
                          },
                        })
                      }
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
      )}
    </div>
  );
};

export default UserManagement;
