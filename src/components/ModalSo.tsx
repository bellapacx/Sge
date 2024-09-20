import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface SubAgentPrice {
  sub_agent_id: string;
  sell_price: number;
}

interface Product {
  _id: string;
  name: string;
  store_prices?: { store_id: string; sell_price: number }[];
  sub_agent_prices?: SubAgentPrice[];
  default_sell_price: number;
}

interface SubAgent {
  _id: string;
  name: string;
  contact_info: string;
  assigned_stores: { _id: string; name: string; location: string }[];
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: {
    store_id: string;
    product_id: string;
    quantity: number;
    sell_date: string;
    customer_name: string;
    pricing_type: string;
    sub_agent_id?: string; // Optional field for sub-agent
  }) => void;
  userStoreId: string; // userStoreId prop
}

const ModalS: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit, userStoreId }) => {
  const [formData, setFormData] = useState({
    store_id: userStoreId || '',
    product_id: '',
    quantity: 0,
    sell_date: new Date().toISOString().split('T')[0],
    customer_name: '',
    pricing_type: 'store', // Default to store pricing
    sub_agent_id: '', // Initialize for sub-agent selection
  });

  const [stores, setStores] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [subAgents, setSubAgents] = useState<SubAgent[]>([]);

  useEffect(() => {
    const fetchStoresProductsAndSubAgents = async () => {
      try {
        const [storeResponse, productResponse, subAgentResponse] = await Promise.all([
          axios.get('https://sgebackend.onrender.com/api/stores'),
          axios.get('https://sgebackend.onrender.com/api/products'),
          axios.get('https://sgebackend.onrender.com/api/subagent'),
        ]);

        const userStore = storeResponse.data.find((store: any) => store._id === userStoreId);
        setStores(userStore ? [userStore] : []);
        setProducts(productResponse.data);
        setSubAgents(subAgentResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchStoresProductsAndSubAgents();
  }, [userStoreId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Add Sell Order</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="store_id" className="block text-sm font-medium text-gray-700">Store</label>
            <select
              id="store_id"
              name="store_id"
              value={formData.store_id}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              disabled
            >
              <option value={userStoreId}>{stores.length > 0 ? stores[0].name : 'Loading...'}</option>
            </select>
          </div>
          <div>
            <label htmlFor="product_id" className="block text-sm font-medium text-gray-700">Product</label>
            <select
              id="product_id"
              name="product_id"
              value={formData.product_id}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Product</option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>{product.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="sell_date" className="block text-sm font-medium text-gray-700">Sell Date</label>
            <input
              type="date"
              id="sell_date"
              name="sell_date"
              value={formData.sell_date}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700">Customer Name</label>
            <input
              type="text"
              id="customer_name"
              name="customer_name"
              placeholder="Customer Name"
              value={formData.customer_name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="pricing_type" className="block text-sm font-medium text-gray-700">Pricing Type</label>
            <select
              id="pricing_type"
              name="pricing_type"
              value={formData.pricing_type}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="store">Store Price</option>
              <option value="sub_agent">Sub-Agent Price</option>
            </select>
          </div>
          {formData.pricing_type === 'sub_agent' && (
            <div>
              <label htmlFor="sub_agent_id" className="block text-sm font-medium text-gray-700">Sub-Agent</label>
              <select
                id="sub_agent_id"
                name="sub_agent_id"
                value={formData.sub_agent_id}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select Sub-Agent</option>
                {subAgents.map((subAgent) => (
                  <option key={subAgent._id} value={subAgent._id}>{subAgent.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded-md">Submit</button>
          <button onClick={onClose} className="bg-gray-300 text-black px-4 py-2 rounded-md">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ModalS;
