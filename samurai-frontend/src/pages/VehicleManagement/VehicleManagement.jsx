const VehicleManagement = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex gap-3 justify-between items-center">
        <h1 className="text-2xl font-semibold mb-4">Vehicles Management</h1>
        <button className="btn btn-wide btn-outline">Add Vehicle</button>
      </div>

      <div className="border-2 rounded-lg my-4">
        <h2 className="text-lg font-semibold mt-6 mx-auto text-center mb-3">
          Available Vehicles
        </h2>
        <div className="overflow-x-auto pb-4">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th></th>
                <th>Reg. No.</th>
                <th>Type</th>
                <th>Capacity</th>
                <th>Fuel Cost Per Kilo (fully loaded)</th>
                <th>Fuel Cost Per Kilo (fully unloaded)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>1</th>
                <td>ABC123</td>
                <td>Open Truck</td>
                <td>5 ton</td>
                <td>$0.20</td>
                <td>$0.15</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VehicleManagement;
