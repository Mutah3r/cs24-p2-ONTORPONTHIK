import Swal from "sweetalert2";

// Function to show a SweetAlert
const showAlert = (title, icon) => {
  Swal.fire({
    position: "top-end",
    icon: icon,
    title: title,
    showConfirmButton: false,
    timer: 1500,
  });
};

export { showAlert };
