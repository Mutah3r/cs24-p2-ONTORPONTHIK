import axios from "axios";
import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import Swal from "sweetalert2";

const ManageThirdParty = () => {
  const [thirdParties, setThirdParties] = useState([]);
  const [thirdPartyCompanies, setThirdPartyCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("http://localhost:8000/thirdparties/allthirdparties")
      .then((res) => {
        setThirdParties(res.data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [refetch]);

  useEffect(() => {
    axios.get("http://localhost:8000/thirdparties/allcompany").then((res) => {
      console.log(res.data);
      setThirdPartyCompanies(res.data);
    });
  }, [refetch]);

  function getObjectIdByCompanyName(companyName) {
    for (const company of thirdPartyCompanies) {
      if (company.name_of_the_company === companyName) {
        return company.objectId;
      }
    }
    return null; // Return null if company name is not found
  }

  const handleAddContractor = () => {
    Swal.fire({
      title: "Add New Third-Party Contractor",
      html: `
            <input id="company-name" class="swal2-input" placeholder="Company Name">
            <input id="registration-id" class="swal2-input" placeholder="Registration ID" type="text">
            <input id="registration-date" class="swal2-input" placeholder="Registration Date" type="text">
            <input id="tin" class="swal2-input" placeholder="TIN" type="text">
            <input id="contract-number" class="swal2-input" placeholder="Contract Number">
            <input id="workforce-size" class="swal2-input" placeholder="Workforce Size">
            <input id="payment-per-tonnage" class="swal2-input" placeholder="Payment Per Tonnage of Waste">
            <input id="required-amount-per-day" class="swal2-input" placeholder="The required amount of waste per day">
            <input id="contract-duration" class="swal2-input" placeholder="Contract Duration">
            <input id="area-of-collection" class="swal2-input" placeholder="Area of Collection">
            <input id="designated-sts" class="swal2-input" placeholder="Designated STS">
          `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const companyName = document.getElementById("company-name").value;
        const reg_id = document.getElementById("registration-id").value;
        const reg_date = document.getElementById("registration-date").value;
        const tin = document.getElementById("tin").value;
        const contract_no = document.getElementById("contract-number").value;
        const workforce_size = document.getElementById("workforce-size").value;
        const payment_per_tonnage = document.getElementById(
          "payment-per-tonnage"
        ).value;
        const required_amount_per_day = document.getElementById(
          "required-amount-per-day"
        ).value;
        const contract_duration =
          document.getElementById("contract-duration").value;
        const area_of_collection =
          document.getElementById("area-of-collection").value;
        const designated_sts = document.getElementById("designated-sts").value;

        if (
          !companyName ||
          !reg_id ||
          !reg_date ||
          !tin ||
          !contract_no ||
          !workforce_size ||
          !payment_per_tonnage ||
          !required_amount_per_day ||
          !contract_duration ||
          !area_of_collection ||
          !designated_sts
        ) {
          Swal.showValidationMessage("Please fill in all fields");
          return false;
        }

        return {
          companyName,
          reg_id,
          reg_date,
          tin,
          contract_no,
          workforce_size,
          payment_per_tonnage,
          required_amount_per_day,
          contract_duration,
          area_of_collection,
          designated_sts,
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setIsLoading(true);

        // make a network call in post method to update the information in the database
        axios
          .post("http://localhost:8000/thirdparties/thirdparty", {
            name_of_the_company: result.value.companyName,
            registration_id: result.value.reg_id,
            registration_date: result.value.reg_date,
            tin_of_the_company: result.value.tin,
            contact_number: result.value.contract_no,
            workforce_size: parseInt(result.value.workforce_size),
            payment_per_tonnage_of_waste: parseFloat(
              result.value.payment_per_tonnage
            ),
            required_amount_of_waste_per_day: parseFloat(
              result.value.required_amount_per_day
            ),
            contract_duration: result.value.contract_duration,
            area_of_collection: result.value.area_of_collection,
            designated_sts: parseInt(result.value.designated_sts),
          })
          .then((res) => {
            if (
              res.data?.message ===
              "New third-party contractor added successfully"
            ) {
              Swal.fire({
                title: "Good job!",
                text: "New third-party contractor added successfully!",
                icon: "success",
              });
            }
            setIsLoading(false);
            setRefetch(!refetch);
          })
          .catch(() => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!",
              footer: '<a href="#">Why do I have this issue?</a>',
            });
            setIsLoading(false);
          });
      }
    });
  };

  const handleAddContractorManager = () => {
    Swal.fire({
      title: "Add New Contractor Manager",
      html: `
              <input id="contractor-name" class="swal2-input" placeholder="Full Name">
              <input id="contract-username" class="swal2-input" placeholder="Username">
              <input id="contractor-email" type="email" class="swal2-input" placeholder="Contractor Email" type="text">
              <input id="password" type="password" class="swal2-input" placeholder="Password" type="text">
              <input id="date-of-account-creation" class="swal2-input" placeholder="Account Creation Date">
              <input id="contact-number" class="swal2-input" placeholder="Contact Number">
              <select id="assigned-contractor-company" class="swal2-select" placeholder="Type">
                ${
                  thirdPartyCompanies &&
                  thirdPartyCompanies
                    .map(
                      (company) => `
                <option key="${company.objectId}" value="${company.name_of_the_company}">${company.name_of_the_company}</option>
                `
                    )
                    .join("")
                }
              </select>
              <input id="access-level" class="swal2-input" placeholder="Access Level">
            `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const contractor_name =
          document.getElementById("contractor-name").value;
        const contract_username =
          document.getElementById("contract-username").value;
        const contractor_email =
          document.getElementById("contractor-email").value;
        const password = document.getElementById("password").value;
        const date_of_account_creation = document.getElementById(
          "date-of-account-creation"
        ).value;
        const contact_number = document.getElementById("contact-number").value;
        const assigned_contractor_company = getObjectIdByCompanyName(document.getElementById(
          "assigned-contractor-company"
        ).value);
        const access_level = document.getElementById("access-level").value;

        if (
          !contractor_name ||
          !contract_username ||
          !contractor_email ||
          !password ||
          !date_of_account_creation ||
          !contact_number ||
          !assigned_contractor_company ||
          !access_level
        ) {
          Swal.showValidationMessage("Please fill in all fields");
          return false;
        }

        return {
          contractor_name,
          contract_username,
          contractor_email,
          password,
          date_of_account_creation,
          contact_number,
          assigned_contractor_company,
          access_level,
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setIsLoading(true);

        console.log(result.value);

        axios
          .post("http://localhost:8000/thirdparties/addnewmanager", {
            name: result.value.contractor_name,
            email: result.value.contractor_email,
            password: result.value.password,
            role: result.value.role,
            token: JSON.parse(localStorage.getItem("user")),
            contact_number: result.value.contact_number,
            assigned_contractor_company:
              result.value.assigned_contractor_company,
            access_level: result.value.access_level,
            username: result.value.contract_username,
          })
          .then((res) => {
            Swal.fire({
              title: "Good job!",
              text: res.data?.message,
              icon: "success",
            });

            setIsLoading(false);
            setRefetch(!refetch);
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: error.response?.data?.message,
            });
            setIsLoading(false);
          });
      }
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-3 justify-between items-center">
        <h1 className="text-2xl font-semibold mb-4">
          Third-Party Contractor Management
        </h1>
        <div className="flex flex-col gap-2">
          <button
            className="btn md:btn-wide btn-outline"
            onClick={handleAddContractor}
          >
            Add New Third-Party Contractor
          </button>
          <button
            className="btn md:btn-wide btn-outline"
            onClick={handleAddContractorManager}
          >
            Add New Contractor Manager
          </button>
        </div>
      </div>

      <div className="border-2 rounded-lg my-4">
        <h2 className="text-lg font-semibold mt-6 mx-auto text-center mb-3">
          Available Third-Party Contractors
        </h2>
        {isLoading && (
          <div className="mx-auto flex justify-center items-center py-5">
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

      {!isLoading && (
        <div className="overflow-x-auto pb-4">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th></th>
                <th>Company Name</th>
                <th>Reg. ID</th>
                <th>Reg. Date</th>
                <th>TIN</th>
                <th>Contact number</th>
                <th>Workforce size</th>
                <th>Payment per tonnage of waste</th>
                <th>The required amount of waste per day</th>
                <th>Contract duration</th>
                <th>Area of collection</th>
                <th>Designated STS</th>
              </tr>
            </thead>
            <tbody>
              {thirdParties &&
                thirdParties.map((party, idx) => {
                  return (
                    <tr key={idx}>
                      <th>{idx + 1}</th>
                      <td>{party.name_of_the_company}</td>
                      <td>{party.registration_id}</td>
                      <td>{party.registration_date}</td>
                      <td>{party.tin_of_the_company}</td>
                      <td>{party.contact_number}</td>
                      <td>{party.workforce_size}</td>
                      <td>{party.payment_per_tonnage_of_waste}</td>
                      <td>{party.required_amount_of_waste_per_day}</td>
                      <td>{party.contract_duration}</td>
                      <td>{party.area_of_collection}</td>
                      <td>{party.designated_sts}</td>
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

export default ManageThirdParty;
