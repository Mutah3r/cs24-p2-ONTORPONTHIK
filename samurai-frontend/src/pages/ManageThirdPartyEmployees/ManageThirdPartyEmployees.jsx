import axios from "axios";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import ClipLoader from "react-spinners/ClipLoader";
import Swal from "sweetalert2";

const ManageThirdPartyEmployees = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleAddNewEmployee = () => {
    // endpoint: /thirdparties/addnewemployee
    Swal.fire({
      title: "Add New Employee",
      html: `
                <input id="full-name" class="swal2-input" placeholder="Full Name">
                <input id="date-of-birth" class="swal2-input" placeholder="Date of Birth">
                <input id="date-of-hire" class="swal2-input" placeholder="Date of Hire" type="text">
                <input id="job-title" class="swal2-input" placeholder="Job Title">
                <input id="payment-rate-per-hour" class="swal2-input" placeholder="Payment Rate Per Hour" type="text">
                <input id="contact-information" class="swal2-input" placeholder="Contact Information">
                <input id="assigned-collection-route" class="swal2-input" placeholder="Assigned Collection Route">
                <input id="assigned-sts" class="swal2-input" placeholder="Current" disabled>
              `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const full_name = document.getElementById("full-name").value;
        const date_of_birth = document.getElementById("date-of-birth").value;
        const date_of_hire = document.getElementById("date-of-hire").value;
        const job_title = document.getElementById("job-title").value;
        const payment_rate_per_hour = document.getElementById(
          "payment-rate-per-hour"
        ).value;
        const contact_information = document.getElementById(
          "contact-information"
        ).value;
        const assigned_collection_route = document.getElementById(
          "assigned-collection-route"
        ).value;

        if (
          !full_name ||
          !date_of_birth ||
          !date_of_hire ||
          !job_title ||
          !payment_rate_per_hour ||
          !contact_information ||
          !assigned_collection_route
        ) {
          Swal.showValidationMessage("Please fill in all fields");
          return false;
        }

        return {
          full_name,
          date_of_birth,
          date_of_hire,
          job_title,
          payment_rate_per_hour,
          contact_information,
          assigned_collection_route,
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setIsLoading(true);

        console.log(result.value);

        axios
          .post(`http://localhost:8000/thirdparties/addnewemployee`, {
            token: JSON.parse(localStorage.getItem("user")),
            full_name: result.value.full_name,
            date_of_birth: result.value.date_of_birth,
            date_of_hire: result.value.date_of_hire,
            job_title: result.value.job_title,
            payment_rate_per_hour: result.value.payment_rate_per_hour,
            contact_information: result.value.contact_information,
            assigned_collection_route: result.value.assigned_collection_route,
          })
          .then((res) => {
            setIsLoading(false);
            Swal.fire({
              title: "Good job!",
              text: res.data?.message,
              icon: "success",
            });
          })
          .catch((error) => {
            setIsLoading(false);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: error.response?.data?.message,
            });
          });

        // axios
        //   .post("http://localhost:8000/thirdparties/addnewmanager", {
        //     name: result.value.contractor_name,
        //     email: result.value.contractor_email,
        //     password: result.value.password,
        //     role: result.value.role,
        //     token: JSON.parse(localStorage.getItem("user")),
        //     contact_number: result.value.contact_number,
        //     assigned_contractor_company:
        //       result.value.assigned_contractor_company,
        //     access_level: result.value.access_level,
        //     username: result.value.contract_username,
        //   })
        //   .then((res) => {
        //     Swal.fire({
        //       title: "Good job!",
        //       text: res.data?.message,
        //       icon: "success",
        //     });

        //     setIsLoading(false);
        //     setRefetch(!refetch);
        //   })
        //   .catch((error) => {
        //     Swal.fire({
        //       icon: "error",
        //       title: "Oops...",
        //       text: error.response?.data?.message,
        //     });
        //     setIsLoading(false);
        //   });
      }
    });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4 text-center">
        Current Employees
      </h1>

      <div className="flex justify-end">
        <button
          onClick={handleAddNewEmployee}
          className="mt-3 flex gap-2 items-center bg-green-500 text-white hover:bg-white hover:text-green-500 px-4 py-2 text-md rounded-md transition-all duration-200"
        >
          <FaPlus /> Add New Employee
        </button>
      </div>

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
    </div>
  );
};

export default ManageThirdPartyEmployees;
