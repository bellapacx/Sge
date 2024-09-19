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
      // Refresh the store list after adding a new store
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
            labels: store.inventory.map(item => item.product_id.name),
            datasets: [
              {
                data: store.inventory.map(item => item.quantity),
                backgroundColor: store.inventory.map(() => '#' + Math.floor(Math.random()*16777215).toString(16)), // Random colors
              },
            ],
          };

          const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              tooltip: {
                callbacks: {
                  label: function(tooltipItem: any) {
                    const dataset = tooltipItem.dataset;
                    const total = dataset.data.reduce((sum: number, value: number) => sum + value, 0);
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
                  const total = dataset.data.reduce((sum: number, value: number) => sum + value, 0);
                  const percent = ((value / total) * 100).toFixed(2);
                  return `${percent}%`;
                },
                color: '#fff',
              },
            },
          };

          return (
            <div key={store._id} className="bg-gray-300 p-4 rounded-lg shadow-md flex items-start">
              <div className="w-3/4 pr-4">
                <h2 className="text-xl text-black font-semibold mb-2">{store.name}</h2>
                <div>
                  <h3 className="text-lg font-medium mb-2">Stock:</h3>
                  <div className="space-y-2 h-40 overflow-y-scroll">
                    {store.inventory.map((item) => (
                      <div key={item.product_id._id} className="p-2 border text-lg text-black  border-gray-200 rounded-md">
                        <p><strong>{item.product_id.name}</strong></p>
                        {/*<p>Unit: {item.product_id.unit}</p>*/}
                        <p className='font-medium'>Qut: {item.quantity}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="w-1/2 h-40">
                <Pie data={chartData} options={chartOptions} />
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
