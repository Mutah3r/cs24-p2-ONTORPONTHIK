import axios from "axios";
import { MdEdit } from "react-icons/md";
import { IoKey } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [refetch, setRefetch] = useState(false);
  const userToken = JSON.parse(localStorage.getItem("user"));

  const navigate = useNavigate();

  // get logged-in user info
  useEffect(() => {
    axios
      .get(`http://localhost:8000/profile?token=${userToken}`)
      .then((response) => {
        setUserData({
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
        });
      });
  }, [refetch, userToken]);

  const logoutUser = () => {
    axios
      .post("http://localhost:8000/auth/logout", {
        email: JSON.parse(localStorage.getItem("user")),
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

  const handleChangeName = async () => {
    Swal.fire({
      title: "Enter Name",
      input: "text",
      inputPlaceholder: userData.name,
      showCancelButton: true,
      confirmButtonText: "Update",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        if (result.value.length < 2) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please Enter a Valid Name!",
          });
          return;
        }
        axios
          .get(
            `http://localhost:8000/profile?token=${JSON.parse(
              localStorage.getItem("user")
            )}`
          )
          .then((res) => {
            if (res.data.role) {
              axios
                .put("http://localhost:8000/profile", {
                  name: result.value,
                  email: res.data.email,
                  token: JSON.parse(localStorage.getItem("user")),
                })
                .then((response) => {
                  if (response.data?.user?.role) {
                    Swal.fire({
                      title: "Success!",
                      text: "Name Updated Successfully!",
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
                  Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                  });
                });
            }
          })
          .catch(() => {
            // TODO: kick out the user if the user is unauthorized
            logoutUser();

            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!",
            });
          });
      }
    });
  };

  const handleChangeEmail = async () => {
    Swal.fire({
      title: "Enter Email",
      input: "email",
      inputPlaceholder: userData.email,
      showCancelButton: true,
      confirmButtonText: "Update",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .get(
            `http://localhost:8000/profile?token=${JSON.parse(
              localStorage.getItem("user")
            )}`
          )
          .then((res) => {
            if (res.data.role) {
              axios
                .put("http://localhost:8000/profile", {
                  name: res.data.name,
                  email: result.value,
                  token: JSON.parse(localStorage.getItem("user")),
                })
                .then((response) => {
                  if (response.data?.user?.role) {
                    Swal.fire({
                      title: "Success!",
                      text: "Name Updated Successfully!",
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
                  Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                  });
                });
            }
          })
          .catch(() => {
            // TODO: kick out the user if the user is unauthorized
            logoutUser();

            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!",
            });
          });
      }
    });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Profile</h1>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Current Information</h2>
        {!userData && "Loading..."}
        {userData && (
          <>
            <p className="flex gap-3 items-center">
              <span className="font-semibold">Name:</span> {userData.name}
              <button
                onClick={handleChangeName}
                type="submit"
                className="p-1 flex gap-2 items-center bg-green-500 text-white hover:bg-white hover:text-green-500 text-xl rounded-md transition-all duration-200"
              >
                <MdEdit className="text-[15px]" />
              </button>
            </p>
            <p className="flex gap-3 items-center">
              <span className="font-semibold">Email:</span> {userData.email}
              <button
                onClick={handleChangeEmail}
                type="submit"
                className="p-1 flex gap-2 items-center bg-green-500 text-white hover:bg-white hover:text-green-500 text-xl rounded-md transition-all duration-200"
              >
                <MdEdit className="text-[15px]" />
              </button>
            </p>
            <p>
              <span className="font-semibold">Role:</span> {userData.role}
            </p>
            <button
              type="submit"
              className="px-4 py-2 flex gap-2 items-center bg-green-500 text-white hover:bg-white hover:text-green-500 text-md mt-4 rounded-md transition-all duration-200"
            >
              <>
                Change Password <IoKey />
              </>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
