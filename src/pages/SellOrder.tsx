import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '../components/ModalSo';

interface Store {
  _id: string;
  name: string;
  location: string;
}

interface Product {
  _id: string;
  name: string;
  category: string;
  sell_price: number; 
}

interface SellOrder {
  _id: string;
  store_id: Store;
  product_id: Product;
  quantity: number;
  sell_price: number;
  sell_date: Date;
  customer_name: string;
  created_at: Date;
}

const SellOrders: React.FC = () => {
  const [sellOrders, setSellOrders] = useState<SellOrder[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userStoreId, setUserStoreId] = useState<string | null>(null); // Store ID from current user
  const [isAdmin, setIsAdmin] = useState(false); // User role status

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('https://sgebackend.onrender.com/api/current-user', {
            method: 'GET',                  
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            // Ensure cookies are sent with the request
        });
        if (response.ok) {
            const data = await response.json();
            setUserStoreId(data.store_id); // Get store_id from current user
            setIsAdmin(data.role === 'admin'); // Check if user is admin
        } else {
            throw new Error('Failed to fetch user data');
        }
       
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchSellOrders = async () => {
      try {
        const response = await axios.get('https://sgebackend.onrender.com/api/sorders');
        const orders = response.data;

        // Filter orders based on role
        const filteredOrders = isAdmin 
          ? orders 
          : orders.filter((order: SellOrder) => order.store_id._id === userStoreId);

        // Sort orders by sell_date in descending order (latest to oldest)
        const sortedOrders = filteredOrders.sort((a: SellOrder, b: SellOrder) => 
          new Date(b.sell_date).getTime() - new Date(a.sell_date).getTime()
        );

        setSellOrders(sortedOrders);
      } catch (error) {
        console.error('Error fetching sell orders:', error);
      }
    };

    fetchSellOrders();
  }, [userStoreId, isAdmin]);

  const handleAddSellOrder = async (formData: {
    store_id: string;
    product_id: string;
    quantity: number;
    sell_date: string;
    customer_name: string;
  }) => {
    try {
      const productResponse = await axios.get(`https://sgebackend.onrender.com/api/products/${formData.product_id}`);
      const product = productResponse.data as Product;
      const sell_price = product.sell_price * formData.quantity;

      const dataToSubmit = {
        ...formData,
        sell_price,
      };

      console.log("Submitting the following data:", dataToSubmit);

      await axios.post('https://sgebackend.onrender.com/api/sorders', dataToSubmit);
      console.log("Sell order submitted successfully");

      await updateEmptyCrates(formData.store_id, formData.product_id, formData.quantity);
      console.log("Empty crates updated successfully");

      const response = await axios.get('https://sgebackend.onrender.com/api/sorders');
      const orders = response.data;

      const filteredOrders = isAdmin 
        ? orders 
        : orders.filter((order: SellOrder) => order.store_id._id === userStoreId);
      const sortedOrders = filteredOrders.sort((a: SellOrder, b: SellOrder) => 
        new Date(b.sell_date).getTime() - new Date(a.sell_date).getTime()
      );

      setSellOrders(sortedOrders);
    } catch (err) {
      console.error('Error adding sell order:', err);

      if (axios.isAxiosError(err)) {
        console.error('Axios error response:', err.response?.data);
      } else {
        console.error('Unexpected error:', err);
      }
    } finally {
      setIsModalOpen(false);
    }
  };
  
  const updateEmptyCrates = async (storeId: string, productId: string, quantity: number) => {
    try {
      let emptyCrates;

      try {
        const response = await axios.get(`https://sgebackend.onrender.com/api/emptycrates/${storeId}`);
        emptyCrates = response.data;

        if (emptyCrates.error === "No empty crates found for the specified store") {
          emptyCrates = {
            store_id: storeId,
            inventory: [],
            created_at: new Date(),
            updated_at: new Date(),
          };

          await axios.post('https://sgebackend.onrender.com/api/emptycrates', {
            store_id: storeId,
            inventory: [{ product_id: productId, quantity: quantity }],
          });

          console.log('Created new empty crates entry');
          return;
        }
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          emptyCrates = {
            store_id: storeId,
            inventory: [],
            created_at: new Date(),
            updated_at: new Date(),
          };

          await axios.post('https://sgebackend.onrender.com/api/emptycrates', {
            store_id: storeId,
            inventory: [{ product_id: productId, quantity: quantity }],
          });

          console.log('Created new empty crates entry');
          return;
        } else {
          throw err;
        }
      }

      const existingProductIndex = emptyCrates.inventory.findIndex(
        (item: { product_id: string }) => item.product_id === productId
      );
      if (existingProductIndex >= 0) {
        emptyCrates.inventory[existingProductIndex].quantity -= quantity;
      } else {
        emptyCrates.inventory.push({ product_id: productId, quantity: quantity });
      }

      await axios.put(`https://sgebackend.onrender.com/api/emptycrates/${storeId}`, {
        inventory: emptyCrates.inventory,
        updated_at: new Date(),
      });

      console.log('Updated empty crates entry');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error('Error updating empty crates:', err.response?.data || err.message);
      } else {
        console.error('Unexpected error:', err);
      }
    }
  };

  return (
    <div>
      <h1>Sell Orders</h1>
      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-4 bg-gray-600 text-white px-4 py-2 rounded-md"
      >
        Add Sell Order
      </button>
      <div className="overflow-x-auto">
        <div className="min-w-full">
          <table className="divide-y divide-gray-200 w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Store Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sell Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sell Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer Name
                </th>
              </tr>
              </thead>
            </table>
            <div className="max-h-96 overflow-y-auto bg-white">
            <table className="divide-y divide-gray-200 w-full">
            <tbody >
              {sellOrders.map((so) => (
                <tr key={so._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{so.store_id.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{so.product_id.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{so.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${so.sell_price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(so.sell_date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{so.customer_name}</td>
                </tr>
              ))}
            </tbody>
            </table>
            </div>
        
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleAddSellOrder} 
        userStoreId={userStoreId!} // Ensure userStoreId is passed here
      />
    </div>
  );
};

export default SellOrders;
