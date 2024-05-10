import { FaPlus } from "react-icons/fa";

const ManageThirdPartyEmployees = () => {
  const handleAddNewEmployee = () => {
    console.log("add new employee");
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
    </div>
  );
};

export default ManageThirdPartyEmployees;
