import axios from "axios";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import ClipLoader from "react-spinners/ClipLoader";
import Swal from "sweetalert2";

const ManageThirdPartyEmployees = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    axios
      .get(
        `http://localhost:8000/thirdparties/getemployees/${JSON.parse(
          localStorage.getItem("user")
        )}`
      )
      .then((res) => {
        console.log(res.data?.employees);
        setEmployees(res.data?.employees);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, [refetch]);

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
            setRefetch(!refetch);
            Swal.fire({
              title: "Good job!",
              text: res.data?.message,
              icon: "success",
            });
          })
          .catch((error) => {
            setIsLoading(false);
            setRefetch(!refetch);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: error.response?.data?.message,
            });
          });
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

      {!isLoading && (
        <div className="overflow-x-auto pb-4 my-6">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Job Title</th>
                <th>Date of Birth</th>
                <th>Payment Rate Per Hour</th>
                <th>Contact Info</th>
                <th>Assigned STS</th>
              </tr>
            </thead>
            <tbody>
              {employees &&
                employees.map((e, idx) => {
                  return (
                    <tr key={idx}>
                      <th>{idx + 1}</th>
                      <td>{e.full_name}</td>
                      <td>{e.job_title}</td>
                      <td>{e.date_of_birth}</td>
                      <td>{e.payment_rate_per_hour} BDT</td>
                      <td>{e.contact_information}</td>
                      <td>{e.assigned_sts}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageThirdPartyEmployees;
