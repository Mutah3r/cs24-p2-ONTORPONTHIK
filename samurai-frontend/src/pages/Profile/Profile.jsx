import axios from "axios";
import { MdEdit } from "react-icons/md";
import { IoKey } from "react-icons/io5";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const userToken = JSON.parse(localStorage.getItem("user"));

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
  }, []);

  const handleChangeName = () => {
    Swal.fire({
      title: "Enter Name",
      input: "text",
      inputPlaceholder: userData.name,
      showCancelButton: true,
      confirmButtonText: "Update",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("User entered name:", result.value);
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
                onClick={handleChangeName}
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
