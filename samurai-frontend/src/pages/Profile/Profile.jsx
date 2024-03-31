import axios from "axios";
import { MdEdit } from "react-icons/md";
import { IoKey } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import Swal from "sweetalert2";

const Profile = () => {
  const [spinner, setSpinner] = useState(false);
  const [userData, setUserData] = useState(null);
  const [refetch, setRefetch] = useState(false);
  const userToken = JSON.parse(localStorage.getItem("user"));

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

  const handleChangePassword = () => {
    setSpinner(true);
    Swal.fire({
      title: "Change Password",
      html: `
        <input id="new-password" class="swal2-input" type="password" placeholder="New Password">
        <input id="confirm-password" class="swal2-input" type="password" placeholder="Confirm Password">
      `,
      showCancelButton: true,
      focusConfirm: false,
      preConfirm: () => {
        const newPassword =
          Swal.getPopup().querySelector("#new-password").value;
        const confirmPassword =
          Swal.getPopup().querySelector("#confirm-password").value;

        if (!newPassword || !confirmPassword) {
          Swal.showValidationMessage("Please enter both passwords");
          setSpinner(false);
          return;
        }

        if (newPassword !== confirmPassword) {
          Swal.showValidationMessage("Passwords do not match");
          setSpinner(false);
          return;
        }

        return { newPassword, confirmPassword };
      },
    })
      .then((result) => {
        if (result.isConfirmed) {
          axios
            .post("http://localhost:8000/auth/change-password", {
              token: JSON.parse(localStorage.getItem("user")),
              newPassword: result.value.newPassword,
            })
            .then((res) => {
              if (res.data.message === "Password updated successfully") {
                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "Password updates successfully",
                  showConfirmButton: false,
                  timer: 1500,
                });
              } else {
                Swal.fire({
                  position: "top-end",
                  icon: "error",
                  title: "Password was not updated!",
                  showConfirmButton: false,
                  timer: 1500,
                });
              }
              setSpinner(false);
            });
        } else {
          setSpinner(false);
        }
      })
      .catch(() => {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Password was not updated!",
          showConfirmButton: false,
          timer: 1500,
        });
        setSpinner(false);
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
      <h1 className="text-2xl font-semibold mb-4 text-center">Profile</h1>
      <div className="mb-4">
        {!userData && "Loading..."}
        {userData && (
          <div className="flex flex-col items-center gap-2">
            <FaUser className="text-[50px] my-2" />
            <h2 className="text-lg font-semibold mb-2 text-center">
              Current Information
            </h2>
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
              disabled={spinner}
              onClick={handleChangePassword}
              type="submit"
              className="px-4 py-2 flex gap-2 items-center bg-green-500 text-white hover:bg-white hover:text-green-500 text-md mt-4 rounded-md transition-all duration-200"
            >
              {!spinner && (
                <>
                  Change Password <IoKey />
                </>
              )}
              {spinner && "Loading.."}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
