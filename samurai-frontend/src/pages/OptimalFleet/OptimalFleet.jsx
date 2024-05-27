import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const OptimalFleet = () => {
    const [availableFleet, setAvailableFleet] = useState(null);
    const [selectedFleets, setSelectedFleets] = useState({
        open_truck: false,
        compactor: false,
        dump_truck: false,
        container_carrier: false,
    });
    const [optimalFleetResult, setOptimalFleetResult] = useState(null);
    const [showOptimalResult, setShowOptimalResult] = useState(false);

    useEffect(() => {
        axios
            .get("https://cs24-p2-ontorponthik.onrender.com/vehicle/fleetview")
            .then((res) => {
                setAvailableFleet(res.data);
            });
    }, []);

    const handleFleetSelect = (fleetName) => {
        if (selectedFleets && selectedFleets[fleetName]) {
            setSelectedFleets({
                ...selectedFleets,
                [fleetName]: false,
            });
        } else {
            setSelectedFleets({
                ...selectedFleets,
                [fleetName]: true,
            });
        }
    };

    const handleRequestOptimalFleets = () => {
        setShowOptimalResult(false);

        const params = {
            token: JSON.parse(localStorage.getItem("user")),
            Dump_Truck: selectedFleets?.dump_truck ? "Dump Truck" : "",
            Compactor: selectedFleets?.compactor ? "Compactor" : "",
            Container_Carrier: selectedFleets?.container_carrier
                ? "Container Carrier"
                : "",
            total_waste: 15, //
        };

        axios
            .get(
                "https://cs24-p2-ontorponthik.onrender.com/vehicle/fleetoptimized",
                { params }
            )
            .then((res) => {
                setOptimalFleetResult(res.data);
                setShowOptimalResult(true);
            })
            .catch((error) => {
                setShowOptimalResult(false);
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: error.response?.data?.message,
                });
            });
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-4 text-center">
                Optimal Fleet View
            </h1>
            <h2 className="text-center text-[20px]  mb-6">
                Available Vehicles
            </h2>

            <div className="grid gird-cols-2 md:grid-cols-4 gap-6 text-center">
                <div
                    onClick={() => handleFleetSelect("open_truck")}
                    className={`cursor-pointer hover:bg-slate-300 transition-all duration-200 border-2 rounded-lg shadow-md  p-4 flex flex-col items-center justify-center ${
                        selectedFleets.open_truck
                            ? "bg-green-400 hover:bg-slate-400"
                            : "bg-slate-200"
                    } `}
                >
                    <h3 className="mb-2 font-semibold">Open Truck</h3>
                    <h4 className="font-bold text-xl">
                        {availableFleet && availableFleet.open_truck}
                    </h4>
                </div>
                <div
                    onClick={() => handleFleetSelect("compactor")}
                    className={`cursor-pointer hover:bg-slate-300 transition-all duration-200 border-2 rounded-lg shadow-md  p-4 flex flex-col items-center justify-center ${
                        selectedFleets.compactor
                            ? "bg-green-400 hover:bg-slate-400"
                            : "bg-slate-200"
                    } `}
                >
                    <h3 className="mb-2 font-semibold">Compactor</h3>
                    <h4 className="font-bold text-xl">
                        {availableFleet && availableFleet.compactor}
                    </h4>
                </div>
                <div
                    onClick={() => handleFleetSelect("dump_truck")}
                    className={`cursor-pointer hover:bg-slate-300 transition-all duration-200 border-2 rounded-lg shadow-md  p-4 flex flex-col items-center justify-center ${
                        selectedFleets.dump_truck
                            ? "bg-green-400 hover:bg-slate-400"
                            : "bg-slate-200"
                    }`}
                >
                    <h3 className="mb-2 font-semibold">Dump Truck</h3>
                    <h4 className="font-bold text-xl">
                        {availableFleet && availableFleet.dump_truck}
                    </h4>
                </div>
                <div
                    onClick={() => handleFleetSelect("container_carrier")}
                    className={`cursor-pointer hover:bg-slate-300 transition-all duration-200 border-2 rounded-lg shadow-md  p-4 flex flex-col items-center justify-center ${
                        selectedFleets.container_carrier
                            ? "bg-green-400 hover:bg-slate-400"
                            : "bg-slate-200"
                    }`}
                >
                    <h3 className="mb-2 font-semibold">Container Carrier</h3>
                    <h4 className="font-bold text-xl">
                        {availableFleet && availableFleet.container_carrier}
                    </h4>
                </div>
            </div>
            <h3 className="text-center text-green-700 my-5">
                Select vehicles to get optimal results.
            </h3>

            <div className="flex justify-center items-center my-5">
                <button
                    onClick={handleRequestOptimalFleets}
                    className="btn btn-success"
                >
                    Get Optimal Result
                </button>
            </div>

            <div
                className={`mt-8 mb-6 p-6 text-center ${
                    showOptimalResult ? "block" : "hidden"
                }`}
            >
                <h2 className="text-2xl font-semibold mb-4 text-center">
                    Required Vehicles For Optimal Result
                </h2>

                {optimalFleetResult && optimalFleetResult?.open_truck != 0 && (
                    <div>
                        <h3 className="bg-gray-300 px-4 py-6 my-4 rounded-lg font-semibold">
                            Open Truck: {optimalFleetResult.open_truck}
                        </h3>
                    </div>
                )}

                {optimalFleetResult && optimalFleetResult?.dump_truck != 0 && (
                    <div>
                        <h3 className="bg-gray-300 px-4 py-6 my-4 rounded-lg font-semibold">
                            Dump Truck: {optimalFleetResult.dump_truck}
                        </h3>
                    </div>
                )}

                {optimalFleetResult && optimalFleetResult?.compactor != 0 && (
                    <div>
                        <h3 className="bg-gray-300 px-4 py-6 my-4 rounded-lg font-semibold">
                            Compactor: {optimalFleetResult.compactor}
                        </h3>
                    </div>
                )}

                {optimalFleetResult &&
                    optimalFleetResult?.container_carrier != 0 && (
                        <div>
                            <h3 className="bg-gray-300 px-4 py-6 my-4 rounded-lg font-semibold">
                                Container Carrier:{" "}
                                {optimalFleetResult.container_carrier}
                            </h3>
                        </div>
                    )}

                {optimalFleetResult?.total_cost_per_km && (
                    <div>
                        <h3 className="bg-gray-300 px-4 py-6 my-4 rounded-lg font-semibold text-violet-700">
                            Total Cost Per Km :{" "}
                            {optimalFleetResult.total_cost_per_km}
                        </h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OptimalFleet;
