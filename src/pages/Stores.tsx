import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '../components/ModalS';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, ChartDataLabels);

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
}

interface InventoryItem {
  product_id: Product;
  quantity: number;
}

interface Store {
  _id: string;
  name: string;
  location: string;
  manager: string;  // Assuming manager is a string ID for simplicity
  inventory: InventoryItem[];
  created_at: Date;
  updated_at: Date;
}

const Stores: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get('https://sgebackend.onrender.com/api/stores');
        setStores(response.data);
      } catch (error) {
        console.error('Error fetching stores:', error);
      }
    };

    fetchStores();
  }, []);

  const handleAddStore = async (formData: {
    name: string;
    location: string;
    manager: string;  // Assuming manager is a string ID
  }) => {
    try {
      await axios.post('https://sgebackend.onrender.com/api/stores', formData);
      const response = await axios.get('https://sgebackend.onrender.com/api/stores');
      setStores(response.data);
    } catch (error) {
      console.error('Error adding store:', error);
    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Stores</h1>
      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-4 bg-gray-600 text-white px-4 py-2 rounded-md"
      >
        Add Store
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((store) => {
          const chartData = {
            labels: store.inventory.map((item) => item.product_id.name),
            datasets: [
              {
                data: store.inventory.map((item) => item.quantity),
                backgroundColor: store.inventory.map(
                  () => '#' + Math.floor(Math.random() * 16777215).toString(16)
                ), // Random colors
              },
            ],
          };

          const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              tooltip: {
                callbacks: {
                  label: function (tooltipItem: any) {
                    const dataset = tooltipItem.dataset;
                    const total = dataset.data.reduce(
                      (sum: number, value: number) => sum + value,
                      0
                    );
                    const value = dataset.data[tooltipItem.dataIndex];
                    const percent = ((value / total) * 100).toFixed(2);
                    return `${tooltipItem.label}: ${value} (${percent}%)`;
                  },
                },
              },
              datalabels: {
                display: true,
                formatter: (value: number, context: any) => {
                  const dataset = context.dataset;
                  const total = dataset.data.reduce(
                    (sum: number, value: number) => sum + value,
                    0
                  );
                  const percent = ((value / total) * 100).toFixed(2);
                  return `${percent}%`;
                },
                color: '#fff',
              },
            },
          };

          const handleDeleteStore = async (storeId: string) => {
            try {
              await axios.delete(`https://sgebackend.onrender.com/api/stores/${storeId}`);
              const response = await axios.get('https://sgebackend.onrender.com/api/stores');
              setStores(response.data);
            } catch (error) {
              console.error('Error deleting store:', error);
            }
          };

          return (
            <div key={store._id} className="bg-white p-6 rounded-lg shadow-lg flex flex-col md:flex-row items-start transition-transform duration-200 hover:scale-105">
  <div className="w-full md:w-3/4 pr-4 mb-4 md:mb-0">
    <h2 className="text-2xl text-black font-bold mb-2">{store.name}</h2>
    <div>
      <h3 className="text-lg font-semibold mb-2 text-black">Stock:</h3>
      <div className="space-y-2 h-40 overflow-y-scroll border border-gray-200 rounded-md p-2 bg-gray-50">
        {store.inventory.length > 0 ? (
          store.inventory.map((item) => (
            <div key={item.product_id._id} className="p-4 border-b last:border-b-0 border-gray-200 text-lg text-black flex justify-between items-center hover:bg-gray-100 transition duration-200">
              <div>
                <p className="font-semibold">{item.product_id.name}</p>
                <p className="font-medium">Qty: {item.quantity}</p>
              </div>
              <span className="text-sm text-gray-500">{item.product_id.category}</span>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No stock available.</p>
        )}
      </div>
    </div>
  </div>
  <div className="w-full md:w-1/2 h-40 mb-4 md:mb-0">
    <Pie data={chartData} options={chartOptions} />
  </div>
  <div className="mt-4 md:mt-0 md:ml-4 flex flex-col md:flex-row">
  
    <button
      onClick={() => handleDeleteStore(store._id)}
      className="bg-red-600 text-white px-4 py-2 rounded-md transition duration-200 hover:bg-red-500"
    >
      Delete Store
    </button>
  </div>
</div>

          

          );
        })}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddStore} />
    </div>
  );
};

export default Stores;
