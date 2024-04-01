import axios from "axios";
import { useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";
import Swal from "sweetalert2";
import { renderToString } from "react-dom/server";
import ClipLoader from "react-spinners/ClipLoader";
import { useNavigate } from "react-router-dom";

const FacilityManagement = () => {
  const [showSpinner, setShowSpinner] = useState(true);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [refetch, setRefetch] = useState(false);
  const [availabeSts, setAvailableSts] = useState([]);
  const [availabeLandfills, setAvailableLandfills] = useState([]);

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

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setShowSpinner(true);
      try {
        const response = await axios.get("http://localhost:8000/users");
        setUsers(response.data);
        setShowSpinner(false);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
        setShowSpinner(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    axios
      .get(
        `http://localhost:8000/facilities/sts/${JSON.parse(
          localStorage.getItem("user")
        )}`
      )
      .then((response) => {
        setAvailableSts(response.data);
      });
  }, [refetch]);

  useEffect(() => {
    axios
      .get(
        `http://localhost:8000/facilities/allland/${JSON.parse(
          localStorage.getItem("user")
        )}`
      )
      .then((response) => {
        setAvailableLandfills(response.data);
      });
  }, [refetch]);

  const handleAddSTS = () => {
    Swal.fire({
      title: "Add New STS (Solid Waste Transfer Station)",
      html: `
        <input id="wardNumber" class="swal2-input" placeholder="Ward Number">
        <input id="capacity" class="swal2-input" placeholder="Capacity (in Tonnes)">
        <input id="latitude" class="swal2-input" placeholder="Latitude">
        <input id="longitude" class="swal2-input" placeholder="Longitude">
      `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const wardNumber = document.getElementById("wardNumber").value;
        const capacity = document.getElementById("capacity").value;
        const latitude = document.getElementById("latitude").value;
        const longitude = document.getElementById("longitude").value;

        // Validate ward number, capacity, latitude, and longitude inputs
        if (
          !isValidNumber(wardNumber) ||
          !isValidNumber(capacity) ||
          !isValidCoordinate(latitude) ||
          !isValidCoordinate(longitude)
        ) {
          Swal.showValidationMessage(
            "Invalid input. Please enter numeric values."
          );
          return false;
        }

        return {
          wardNumber: parseFloat(wardNumber),
          capacity: parseFloat(capacity),
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setShowSpinner(true);
        axios
          .post("http://localhost:8000/facilities/sts", {
            ward_number: result.value.wardNumber,
            capacity: result.value.capacity,
            latitude: result.value.latitude,
            longitude: result.value.longitude,
            token: JSON.parse(localStorage.getItem("user")),
          })
          .then((res) => {
            if (res.data.message === "STS created successfully") {
              Swal.fire({
                title: "Good job!",
                text: "STS created!",
                icon: "success",
              });
              setRefetch(!refetch);
              setShowSpinner(false);
            } else {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
              });
              setShowSpinner(false);
            }
          })
          .catch(() => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!",
            });
            setShowSpinner(false);
          });
      }
    });
  };

  const handleAddLandfill = () => {
    Swal.fire({
      title: "Add New Landfill Site",
      html: `
        <input id="name" class="swal2-input" placeholder="Name">
        <input id="capacity" class="swal2-input" placeholder="Capacity (in Tonnes)">
        <input id="operationalTimespan" class="swal2-input" placeholder="Operational Timespan">
        <input id="latitude" class="swal2-input" placeholder="Latitude">
        <input id="longitude" class="swal2-input" placeholder="Longitude">
      `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const name = document.getElementById("name").value;
        const capacity = document.getElementById("capacity").value;
        const operationalTimespan = document.getElementById(
          "operationalTimespan"
        ).value;
        const latitude = document.getElementById("latitude").value;
        const longitude = document.getElementById("longitude").value;

        // Validate capacity, operational timespan, latitude, and longitude inputs
        if (
          !isValidNumber(capacity) ||
          operationalTimespan.trim() === "" ||
          !isValidCoordinate(latitude) ||
          !isValidCoordinate(longitude)
        ) {
          Swal.showValidationMessage(
            "Invalid input. Please enter valid values."
          );
          return false;
        }

        return {
          name: name.trim(),
          capacity: parseFloat(capacity),
          operationalTimespan: operationalTimespan.trim(),
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setShowSpinner(true);
        axios
          .post("http://localhost:8000/facilities/land", {
            name: result.value.name,
            operational_timespan: result.value.operationalTimespan,
            capacity: result.value.capacity,
            latitude: result.value.latitude,
            longitude: result.value.longitude,
            token: JSON.parse(localStorage.getItem("user")),
          })
          .then((res) => {
            if (res.data.message === "Landfill created successfully") {
              Swal.fire({
                title: "Good job!",
                text: "Landfill created!",
                icon: "success",
              });
              setRefetch(!refetch);
              setShowSpinner(false);
            } else {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
              });
              setShowSpinner(false);
            }
          })
          .catch(() => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!",
            });
            setShowSpinner(false);
          });
      }
    });
  };

  const isValidNumber = (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
  };

  const isValidCoordinate = (value) => {
    return isValidNumber(value);
  };

  const handleAssignStsManager = (stsID) => {
    Swal.fire({
      title: "Select STS Manager",
      html: loading
        ? "Loading..."
        : renderToString(
            <select className="swal2-select" id="stsManagerDropdown">
              {users.map(
                (user) =>
                  user.role === "STS manager" && (
                    <option key={user._id} value={user._id}>
                      {user.name}
                    </option>
                  )
              )}
            </select>
          ),
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const selectedValue =
          document.getElementById("stsManagerDropdown").value;
        return selectedValue;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setShowSpinner(true);
        axios
          .post("http://localhost:8000/facilities/stsManage", {
            user_id: result.value,
            token: JSON.parse(localStorage.getItem("user")),
            sts_id: stsID,
          })
          .then((res) => {
            if (res.data?.message === "Manager assigned to STS successfully") {
              Swal.fire({
                title: "Good job!",
                text: "STS manager updated successfully!",
                icon: "success",
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "STS manager was not updated!",
              });
            }
            setRefetch(!refetch);
            setShowSpinner(false);
          })
          .catch(() => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "STS manager was not updated!",
            });
            setShowSpinner(false);
          });
      }
    });
  };

  const handleAssignLandfillManager = (landfillID) => {
    Swal.fire({
      title: "Select Landfill Manager",
      html: loading
        ? "Loading..."
        : renderToString(
            <select className="swal2-select" id="landfillManagerDropdown">
              {users.map(
                (user) =>
                  user.role === "Landfill manager" && (
                    <option key={user._id} value={user._id}>
                      {user.name}
                    </option>
                  )
              )}
            </select>
          ),
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const selectedValue = document.getElementById(
          "landfillManagerDropdown"
        ).value;
        return selectedValue;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setShowSpinner(true);
        axios
          .post("http://localhost:8000/facilities/landManage", {
            user_id: result.value,
            token: JSON.parse(localStorage.getItem("user")),
            landfill_id: landfillID,
          })
          .then((res) => {
            if (
              res.data?.message === "Manager assigned to Landfill successfully"
            ) {
              Swal.fire({
                title: "Good job!",
                text: "Landfill manager updated successfully!",
                icon: "success",
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Landfill manager was not updated!",
              });
            }
            setRefetch(!refetch);
            setShowSpinner(false);
          })
          .catch(() => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Landfill manager was not updated!",
            });
            setShowSpinner(false);
          });
      }
    });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Facilities Management</h1>
      <div className="flex flex-col md:flex-row gap-3">
        <button
          className="btn md:btn-wide btn-outline grow"
          onClick={handleAddSTS}
        >
          Create STS
        </button>
        <button
          className="btn md:btn-wide btn-outline grow"
          onClick={handleAddLandfill}
        >
          Create Landfill
        </button>
      </div>

      <div className="border-2 rounded-lg my-4">
        <h2 className="text-lg font-semibold mt-6 mx-auto text-center mb-3">
          Available Landfill Sites
        </h2>

        {showSpinner && (
          <div className="mx-auto flex justify-center items-center py-5">
            <ClipLoader
              color={"#22C55E"}
              loading={showSpinner}
              size={50}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        )}

        {!showSpinner && (
          <div className="overflow-x-auto mb-3">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Capacity</th>
                  <th>Operational Time-span</th>
                  <th>GPS coordinates</th>
                  <th>Manager</th>
                </tr>
              </thead>
              <tbody>
                {availabeLandfills.map((landfill, idx) => (
                  <tr key={landfill._id}>
                    <th>{idx + 1}</th>
                    <td>{landfill.name}</td>
                    <td>{landfill.capacity}</td>
                    <td>{landfill.operational_timespan}</td>
                    <td className="flex flex-col justify-center gap-2">
                      <span>Latitude: {landfill.latitude}</span>
                      <span>Longitude: {landfill.longitude}</span>
                    </td>
                    <td>
                      <div className="flex gap-2 items-center">
                        <span>{landfill.assigned_managers_name}</span>
                        <button
                          onClick={() =>
                            handleAssignLandfillManager(landfill._id)
                          }
                          className="p-1 flex gap-2 items-center bg-green-500 text-white hover:bg-white hover:text-green-500 text-xl rounded-md transition-all duration-200"
                        >
                          <MdEdit className="text-[20px]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="border-2 rounded-lg my-4">
        <h2 className="text-lg font-semibold mt-6 mx-auto text-center mb-3">
          Available Secondary Transfer Stations (STS)
        </h2>

        {showSpinner && (
          <div className="mx-auto flex justify-center items-center py-5">
            <ClipLoader
              color={"#22C55E"}
              loading={showSpinner}
              size={50}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        )}

        {!showSpinner && (
          <div className="overflow-x-auto mb-3">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th></th>
                  <th>Ward No.</th>
                  <th>Capacity</th>
                  <th>GPS coordinates</th>
                  <th>Manager</th>
                </tr>
              </thead>
              <tbody>
                {availabeSts.map((sts, idx) => (
                  <tr key={sts._id}>
                    <th>{idx + 1}</th>
                    <td>{sts.ward_number}</td>
                    <td>{sts.capacity + " ton"}</td>
                    <td className="flex flex-col justify-center gap-2">
                      <span>Latitude: {sts.latitude}</span>
                      <span>Longitude: {sts.longitude}</span>
                    </td>
                    <td>
                      <div className="flex gap-2 items-center">
                        <span>{sts.assigned_managers_name}</span>
                        <button
                          onClick={() => handleAssignStsManager(sts._id)}
                          className="p-1 flex gap-2 items-center bg-green-500 text-white hover:bg-white hover:text-green-500 text-xl rounded-md transition-all duration-200"
                        >
                          <MdEdit className="text-[20px]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacilityManagement;
