import axios from "axios";
import { useEffect, useState } from "react";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const userToken = JSON.parse(localStorage.getItem("user"));

  console.log("this is user token", userToken);
  // get logged-in user info
  useEffect(() => {
    axios
      .get(`http://localhost:8000/profile?token=${userToken}`)
      .then((response) => {
        console.log(response.data);
        setUserData({
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
        });
      });
  }, []);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Update user data with new values
    const newName = e.target.newName.value;
    const newEmail = e.target.newEmail.value;
    const newPassword = e.target.newPassword.value;

    console.log({ newName, newEmail, newPassword });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Profile</h1>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Current Information</h2>
        {!userData && "Loading..."}
        {userData && (
          <>
            <p>
              <span className="font-semibold">Name:</span> {userData.name}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {userData.email}
            </p>
            <p>
              <span className="font-semibold">Role:</span> {userData.role}
            </p>
          </>
        )}
      </div>
      {userData && (
        <form onSubmit={handleSubmit}>
          <h2 className="text-lg font-semibold mb-2">Update Information</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">New Name:</label>
            <input
              type="text"
              name="newName"
              value={userData.name}
              className="form-input"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">New Email:</label>
            <input
              type="email"
              name="newEmail"
              value={userData.email}
              className="form-input"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              New Password:
            </label>
            <input type="password" name="newPassword" className="form-input" />
          </div>

          <button
            type="submit"
            className="mt-3 flex gap-2 items-center bg-green-500 text-white hover:bg-white hover:text-green-500 px-6 py-3 text-xl rounded-md transition-all duration-200"
          >
            Update
          </button>
        </form>
      )}
    </div>
  );
};

export default Profile;
