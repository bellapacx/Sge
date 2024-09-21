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
  sell_price: number; // Default sell price
  store_prices: { store_id: string; sell_price: number }[];
  sub_agent_prices: { sub_agent_id: string; sell_price: number }[];
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
  const [products, setProducts] = useState<Product[]>([]); // State to store products
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userStoreId, setUserStoreId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

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
        });
        if (response.ok) {
          const data = await response.json();
          setUserStoreId(data.store_id);
          setIsAdmin(data.role === 'admin');
        } else {
          throw new Error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://sgebackend.onrender.com/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchCurrentUser();
    fetchProducts(); // Fetch products when the component mounts
  }, []);

  useEffect(() => {
    const fetchSellOrders = async () => {
      try {
        const response = await axios.get('https://sgebackend.onrender.com/api/sorders');
        const orders = response.data;

        // Filter orders based on role
        const filteredOrders = isAdmin 
          ? orders 
          : orders.filter((order: SellOrder) => order.store_id && order.store_id._id === userStoreId); // Check if userStoreId is not null

        // Sort orders by sell_date in descending order
        const sortedOrders = filteredOrders.sort((a: SellOrder, b: SellOrder) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        setSellOrders(sortedOrders);
      } catch (error) {
        console.error('Error fetching sellorders:', error);
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
    sub_agent_id?: string; // Optional
  }) => {
    try {
      // Find the selected product from the products state
      const product = products.find(p => p._id === formData.product_id);
      if (!product) {
        throw new Error('Product not found in the local product list');
      }


      // Determine the sell price based on the pricing type
      

      // Prepare data for submission
      const dataToSubmit = {
        store_id: userStoreId,
        product_id: formData.product_id,
        quantity: formData.quantity,
        sell_date: formData.sell_date,
        customer_name: formData.customer_name,
        pricing_type: formData.sub_agent_id ? 'sub_agent' : 'store', // Determine pricing type
        sub_agent_id: formData.sub_agent_id || null, // Use null if not provided
        
      };

      // Post the new sell order to the backend
      await axios.post('https://sgebackend.onrender.com/api/sorders', dataToSubmit);

      // Update empty crates for the store after a sell order
      const storei = userStoreId ?? '';
      await updateEmptyCrates(storei, formData.product_id, formData.quantity);

      // Fetch updated sell orders and apply filtering/sorting logic
      const response = await axios.get('https://sgebackend.onrender.com/api/sorders');
      const orders = response.data;

      const filteredOrders = isAdmin
        ? orders
        : orders.filter((order: SellOrder) => order.store_id && order.store_id._id === userStoreId);

      const sortedOrders = filteredOrders.sort((a: SellOrder, b: SellOrder) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setSellOrders(sortedOrders);

    } catch (err) {
      console.error('Error adding sell order:', err);
    } finally {
      setIsModalOpen(false); // Close the modal
    }
  };

  const updateEmptyCrates = async (storeId: string, productId: string, quantity: number) => {
    try {
      let emptyCrates;

      try {
        const response = await axios.get(`https://sgebackend.onrender.com/api/emptycrates/${userStoreId}`);
        emptyCrates = response.data;

        if (emptyCrates.error === "No empty crates found for the specified store") {
          emptyCrates = {
            store_id: storeId,
            inventory: [],
            created_at: new Date(),
            updated_at: new Date(),
          };

          await axios.post('https://sgebackend.onrender.com/api/emptycrates', {
            store_id: userStoreId,
            inventory: [{ product_id: productId, quantity: -quantity }],
          });
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
            store_id: userStoreId,
            inventory: [{ product_id: productId, quantity: -quantity }],
          });
          return;
        } else {
          throw err;
        }
      }

      const existingProductIndex = emptyCrates.inventory.findIndex(
        (item: { product_id: string }) => item.product_id === productId
      );
      if (existingProductIndex >= 0) {
        emptyCrates.inventory[existingProductIndex].quantity -= -quantity;
      } else {
        emptyCrates.inventory.push({ product_id: productId, quantity: -quantity });
      }

      await axios.put(`https://sgebackend.onrender.com/api/emptycrates/${userStoreId}`, {
        inventory: emptyCrates.inventory,
        updated_at: new Date(),
      });

    } catch (err) {
      console.error('Error updating empty crates:', err);
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
      
        <div className="min-w-full">
          <table className="divide-y divide-gray-200 w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '150px' }}>Store Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '150px' }}>Product Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '150px' }}>Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '150px' }}>Sell Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '150px' }}>Sell Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '150px' }}>Customer Name</th>
              </tr>
            </thead>
            <tbody style={{ display: 'block', maxHeight: '300px', overflowY: 'auto' }}>
    {sellOrders.map((so) => (
      <tr key={so._id} style={{ display: 'table', tableLayout: 'fixed', width: '100%' }}>
        <td className="px-6 py-4 whitespace-nowrap">
          {so.store_id ? so.store_id.name : 'N/A'}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          {so.product_id ? so.product_id.name : 'N/A'}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">{so.quantity}</td>
        <td className="px-6 py-4 whitespace-nowrap">${so.sell_price.toFixed(2)}</td>
        <td className="px-6 py-4 whitespace-nowrap">{new Date(so.sell_date).toLocaleDateString()}</td>
        <td className="px-6 py-4 whitespace-nowrap">{so.customer_name}</td>
      </tr>
    ))}
  </tbody>
          </table>
        
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleAddSellOrder} 
        userStoreId={userStoreId!}
      />
    </div>
  );
};

export default SellOrders;
