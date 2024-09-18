import React, { useState, useEffect } from 'react';

interface VehicleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { driverName: string; plateNumber: string }) => void;
  initialData?: {
    _id?: string;
    driverName?: string;
    plateNumber?: string;
  };
}

const VehicleForm: React.FC<VehicleFormProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [driverName, setDriverName] = useState(initialData?.driverName || '');
  const [plateNumber, setPlateNumber] = useState(initialData?.plateNumber || '');

  useEffect(() => {
    if (initialData) {
      setDriverName(initialData.driverName || '');
      setPlateNumber(initialData.plateNumber || '');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ driverName, plateNumber });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl mb-4">{initialData ? 'Edit Vehicle' : 'Add Vehicle'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Driver Name</label>
            <input
              type="text"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Plate Number</label>
            <input
              type="text"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleForm;
