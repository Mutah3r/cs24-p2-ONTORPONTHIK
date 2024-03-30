import axios from "axios";
import Swal from "sweetalert2";

const RolesAndPermissions = () => {
  const handleAddNewRole = () => {
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
            console.log(res.data);
            if (res.data?.message === "Role created successfully") {
              Swal.fire({
                title: "Good job!",
                text: "New role created!",
                icon: "success",
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
              });
            }
          })
          .catch((error) => {
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
    </div>
  );
};

export default RolesAndPermissions;
