import axios from "axios";
import { MdEdit } from "react-icons/md";
import { useEffect, useState } from "react";
import { MdDeleteForever } from "react-icons/md";

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/users").then((res) => {
      console.log(res.data);
      setUsers(res.data);
    });
  }, []);

  const handleUserEdit = (userId) => {
    alert("edit user " + userId);
  };

  const handleUserDelete = (userId) => {
    alert("delete user " + userId);
  };

  return (
    <div>
      <h1>This is users management page</h1>

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
