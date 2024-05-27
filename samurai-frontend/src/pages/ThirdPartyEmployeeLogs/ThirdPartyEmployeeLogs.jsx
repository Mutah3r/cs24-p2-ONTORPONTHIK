import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const ThirdPartyEmployeeLogs = () => {
    const [spinner, setSpinner] = useState(false);
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        axios
            .get(
                `https://cs24-p2-ontorponthik.onrender.com/thirdparties/getemployees/${JSON.parse(
                    localStorage.getItem("user")
                )}`
            )
            .then((res) => {
                setEmployees(res.data.employees);
                console.log(res.data);
            });
    }, []);

    const handleLogEntry = (event) => {
        event.preventDefault();
        setSpinner(true);

        const formData = new FormData(event.target);
        const data = {};

        formData.forEach((value, key) => {
            data[key] = value;
        });

        console.log("Form Data:", data);

        if (
            data.employee == "" ||
            data.loginTime == "" ||
            data.logoutTime == "" ||
            data.weight == ""
        ) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please fill-up all the fields",
            });
            setSpinner(false);
            return;
        }

        axios
            .post(
                "https://cs24-p2-ontorponthik.onrender.com/thirdparties/createemployeelog",
                {
                    employee_id: data.employee,
                    log_in_time: data.loginTime,
                    log_out_time: data.logoutTime,
                    waste_carried: data.weight,
                }
            )
            .then((res) => {
                console.log(res.data);
                Swal.fire({
                    title: "Good job!",
                    icon: "success",
                    text: res.data?.message,
                });

                setSpinner(false);
            })
            .catch(() => {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                });
                setSpinner(false);
            });
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-4 text-center">
                Enter Employee Log
            </h1>

            <form
                onSubmit={handleLogEntry}
                className="max-w-md mx-auto mt-8 p-4 bg-white shadow-md rounded-lg"
            >
                <div className="mb-4">
                    <label className="block mb-1 text-gray-700">
                        Employee Name:
                    </label>
                    <select
                        id="employee"
                        name="employee"
                        className="select select-bordered mt-1 block w-full pl-3 pr-10 py-2"
                    >
                        {employees.map((employee) => (
                            <option key={employee._id} value={employee._id}>
                                {employee.full_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block mb-1 text-gray-700">
                        Login Time:
                    </label>
                    <input
                        type="datetime-local"
                        name="loginTime"
                        className="input input-bordered w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1 text-gray-700">
                        Logout Time:
                    </label>
                    <input
                        type="datetime-local"
                        name="logoutTime"
                        className="input input-bordered w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1 text-gray-700">
                        Waste Carried (kg):
                    </label>
                    <input
                        type="text"
                        name="weight"
                        id="fromStsWardNumber"
                        className="input input-bordered w-full"
                    />
                </div>
                <button
                    disabled={spinner}
                    type="submit"
                    className="btn btn-neutral w-full"
                >
                    {spinner ? "Loading..." : "Submit"}
                </button>
            </form>
        </div>
    );
};

export default ThirdPartyEmployeeLogs;
