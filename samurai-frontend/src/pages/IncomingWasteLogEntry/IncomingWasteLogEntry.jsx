import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const IncomingWasteLogEntry = () => {
    const [companies, setCompanies] = useState([]);
    const [spinner, setSpinner] = useState(false);

    useEffect(() => {
        axios
            .get(
                `https://cs24-p2-ontorponthik.onrender.com/thirdparties/getcompanyforsts/${JSON.parse(
                    localStorage.getItem("user")
                )}`
            )
            .then((res) => {
                console.log(res.data);
                setCompanies(res.data);
            });
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        setSpinner(true);

        const formData = new FormData(event.target);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        // Log the form data
        console.log("Form Data:", data);

        if (
            !data.company ||
            !data.timeOfArrival ||
            !data.type ||
            !data.vehicle ||
            !data.amount
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
                `https://cs24-p2-ontorponthik.onrender.com/thirdparties/incomingstsentry`,
                {
                    contractor_id: data.company,
                    time_and_date_of_collection: data.timeOfArrival,
                    type_of_waste_collected: data.type,
                    amount_of_waste_collected: parseFloat(data.amount),
                    vehicle_used_for_transportation: data.vehicle,
                }
            )
            .then((res) => {
                console.log(res.data);
                Swal.fire({
                    title: "Good job!",
                    text: res.data?.message,
                    icon: "success",
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
        <div>
            <h1 className="text-center font-semibold my-6">
                Incoming Waste Log Entry
            </h1>
            <form
                onSubmit={handleSubmit}
                className="max-w-md mx-auto mt-8 p-4 bg-white shadow-md rounded-lg"
            >
                <div className="mb-4">
                    <label className="block mb-1 text-gray-700">
                        Contracted Company:
                    </label>
                    <select
                        name="company"
                        className="select select-bordered w-full"
                    >
                        {companies.map((c) => (
                            <option
                                key={c.name_of_the_company}
                                value={c.contract_id}
                            >
                                {c.name_of_the_company}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block mb-1 text-gray-700">
                        Time of Arrival:
                    </label>
                    <input
                        type="datetime-local"
                        id="timeOfArrival"
                        name="timeOfArrival"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1 text-gray-700">
                        Collected Waste Type:
                    </label>
                    <select
                        name="type"
                        className="select select-bordered w-full"
                    >
                        <option value={"Domestic"}>Domestic</option>
                        <option value={"Plastic"}>Plastic</option>
                        <option value={"Construction waste"}>
                            Construction waste
                        </option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block mb-1 text-gray-700">
                        Amount of Waste Collected (kg):
                    </label>
                    <input
                        type="text"
                        name="amount"
                        className="input input-bordered w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1 text-gray-700">
                        Vehicle Used For Transportation:
                    </label>
                    <input
                        type="text"
                        name="vehicle"
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

export default IncomingWasteLogEntry;
