import { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";

const ManageThirdParty = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [refetch, setRefetch] = useState(false);

    return (
        <div className="container mx-auto p-6">
            <div className="flex flex-col md:flex-row gap-3 justify-between items-center">
                <h1 className="text-2xl font-semibold mb-4">Third-Party Contractor Management</h1>
                <button className="btn md:btn-wide btn-outline">
                    Add New Third-Party Contractor
                </button>
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
        </div>
    );
};

export default ManageThirdParty;