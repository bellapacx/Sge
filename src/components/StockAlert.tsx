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
        console.error("Error fetching stores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  const lowStockProducts = stores.flatMap(store =>
    store.inventory.filter(product => product.quantity < lowStockThreshold).map(product => ({
      storeName: store.name,
      productName: product.product_id.name,
      quantity: product.quantity,
    }))
  );

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Stock Alerts</h3>
      {loading ? (
        <p>Loading...</p>
      ) : lowStockProducts.length > 0 ? (
        <ul>
          {lowStockProducts.map((item, index) => (
            <li key={index} className="flex justify-between py-2 border-b">
              <span>{item.productName} in {item.storeName}</span>
              <span>{item.quantity} left</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No low stock items!</p>
      )}
    </div>
  );
};

export default StockAlert;
