import React, { useEffect, useState } from 'react';
import axios from 'axios';
import VehicleForm from '../components/vehicleForm'; // Import the updated VehicleForm component

interface Vehicle {
  _id: string;
  driverName: string;
  plateNumber: string;
}

const Vehicles: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editVehicle, setEditVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get('https://sgebackend.onrender.com/api/vehicles');
        setVehicles(response.data);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    };

    fetchVehicles();
  }, []);

  const handleAddVehicle = async (formData: { driverName: string; plateNumber: string }) => {
    try {
      if (editVehicle) {
        await axios.put(`https://sgebackend.onrender.com/api/vehicles/${editVehicle._id}`, formData);
      } else {
        await axios.post('https://sgebackend.onrender.com/api/vehicles', formData);
      }
      const response = await axios.get('https://sgebackend.onrender.com/api/vehicles');
      setVehicles(response.data);
    } catch (error) {
      console.error('Error adding or updating vehicle:', error);
    } finally {
      setIsModalOpen(false);
      setEditVehicle(null); // Reset edit vehicle
    }
  };

  const openEditModal = (vehicle: Vehicle) => {
    setEditVehicle(vehicle);
    setIsModalOpen(true);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Vehicles</h1>
      <button
        onClick={() => {
          setEditVehicle(null);
          setIsModalOpen(true);
        }}
        className="mb-4 bg-gray-600 text-white px-4 py-2 rounded-md"
      >
        Add Vehicle
      </button>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plate Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vehicles.map(vehicle => (
              <tr key={vehicle._id}>
                <td className="px-6 py-4 whitespace-nowrap">{vehicle.driverName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{vehicle.plateNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => openEditModal(vehicle)}
                    className="bg-gray-400 text-white px-4 py-2 rounded-md"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <VehicleForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddVehicle}
        initialData={editVehicle ? { _id: editVehicle._id, driverName: editVehicle.driverName, plateNumber: editVehicle.plateNumber } : undefined}
      />
    </div>
  );
};

export default Vehicles;
