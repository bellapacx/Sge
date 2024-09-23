import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Product {
  product_id: {
    _id: string;
    name: string;
    category: string;
  };
  quantity: number;
}

interface Store {
  _id: string;
  name: string;
  inventory: Product[];
}

const StockAlert: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const lowStockThreshold = 100; // Set your threshold here

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get('https://sgebackend.onrender.com/api/stores');
        setStores(response.data);
      } catch (error) {
        console.error('Error fetching stores:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  const lowStockProducts = stores.flatMap(store =>
    store.inventory
      .filter(product => product.quantity < lowStockThreshold)
      .map(product => ({
        storeName: store.name,
        productName: product.product_id.name,
        quantity: product.quantity,
      }))
  );

  return (
    <div className="bg-white shadow-md rounded-lg p-6 animate-fade-in transition-all duration-300">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">📢 Stock Alerts</h3>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : lowStockProducts.length > 0 ? (
        <ul className="space-y-3">
          {lowStockProducts.map((item, index) => (
            <li
              key={index}
              className="flex justify-between items-center py-2 px-4 border-l-4 border-red-500 bg-red-50 rounded shadow-sm animate-slide-in"
            >
              <div className="flex items-center space-x-2">
                
                <span className="text-gray-700">
                  <strong>{item.productName}</strong> in <strong>{item.storeName}</strong>
                </span>
              </div>
              <span className="font-bold text-red-600">{item.quantity} left</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-green-600">No low stock items! 🎉</p>
      )}
    </div>
  );
};

export default StockAlert;
