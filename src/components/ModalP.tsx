import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Store {
  id: string; // Adjust based on your API response
  name: string; // Adjust based on your API response
}

interface SubAgent {
  id: string; // Adjust based on your API response
  name: string; // Adjust based on your API response
}

interface StorePrice {
  store_id: string;
  sell_price: number;
}

interface SubAgentPrice {
  sub_agent_id: string;
  sell_price: number;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    category: string;
    purchase_price: string;
    default_sell_price: string;
    unit: string;
    store_prices?: StorePrice[];
    sub_agent_prices?: SubAgentPrice[];
  }) => void;
  initialData?: {
    name?: string;
    category?: string;
    purchase_price?: string;
    default_sell_price?: string;
    unit?: string;
    store_prices?: StorePrice[];
    sub_agent_prices?: SubAgentPrice[];
  };
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    purchase_price: '',
    default_sell_price: '',
    unit: '',
    store_prices: [] as StorePrice[],
    sub_agent_prices: [] as SubAgentPrice[],
  });

  const [stores, setStores] = useState<Store[]>([]);
  const [subAgents, setSubAgents] = useState<SubAgent[]>([]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        category: initialData.category || '',
        purchase_price: initialData.purchase_price || '',
        default_sell_price: initialData.default_sell_price || '',
        unit: initialData.unit || '',
        store_prices: initialData.store_prices || [],
        sub_agent_prices: initialData.sub_agent_prices || [],
      });
    } else {
      setFormData({
        name: '',
        category: '',
        purchase_price: '',
        default_sell_price: '',
        unit: '',
        store_prices: [],
        sub_agent_prices: [],
      });
    }

    // Fetch stores and sub-agents
    const fetchStores = async () => {
      try {
        const response = await axios.get('https://sgebackend.onrender.com/api/stores'); // Adjust the URL as needed
        setStores(response.data);
      } catch (error) {
        console.error('Error fetching stores:', error);
      }
    };

    const fetchSubAgents = async () => {
      try {
        const response = await axios.get('https://sgebackend.onrender.com/api/subagent'); // Adjust the URL as needed
        setSubAgents(response.data);
      } catch (error) {
        console.error('Error fetching sub-agents:', error);
      }
    };

    fetchStores();
    fetchSubAgents();
  }, [initialData]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleStorePriceChange = (index: number, field: keyof StorePrice, value: string | number) => {
    const updatedStorePrices = [...formData.store_prices];
    updatedStorePrices[index] = {
      ...updatedStorePrices[index],
      [field]: field === 'sell_price' ? Number(value) : value,
    };
    setFormData({ ...formData, store_prices: updatedStorePrices });
  };

  const handleSubAgentPriceChange = (index: number, field: keyof SubAgentPrice, value: string | number) => {
    const updatedSubAgentPrices = [...formData.sub_agent_prices];
    updatedSubAgentPrices[index] = {
      ...updatedSubAgentPrices[index],
      [field]: field === 'sell_price' ? Number(value) : value,
    };
    setFormData({ ...formData, sub_agent_prices: updatedSubAgentPrices });
  };

  const handleAddStorePrice = () => {
    setFormData({ ...formData, store_prices: [...formData.store_prices, { store_id: '', sell_price: 0 }] });
  };

  const handleAddSubAgentPrice = () => {
    setFormData({ ...formData, sub_agent_prices: [...formData.sub_agent_prices, { sub_agent_id: '', sell_price: 0 }] });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: '',
      category: '',
      purchase_price: '',
      default_sell_price: '',
      unit: '',
      store_prices: [],
      sub_agent_prices: [],
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl mb-4">{initialData ? 'Edit Product' : 'Add Product'}</h2>
        <form onSubmit={handleSubmit}>
          {/* Product Form Fields */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Purchase Price</label>
            <input
              type="number"
              name="purchase_price"
              value={formData.purchase_price}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Default Sell Price</label>
            <input
              type="number"
              name="default_sell_price"
              value={formData.default_sell_price}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Unit</label>
            <input
              type="text"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>

          {/* Store Prices */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Store Prices</h3>
            {formData.store_prices.map((storePrice, index) => (
              <div key={index} className="flex mb-2">
                <select
                  className="mt-1 block w-1/2 border-gray-300 rounded-md shadow-sm mr-2"
                  value={storePrice.store_id}
                  onChange={(e) => handleStorePriceChange(index, 'store_id', e.target.value)}
                >
                  <option value="" disabled>Select Store</option>
                  {stores.map(store => (
                    <option key={store.id} value={store.id}>{store.name}</option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Sell Price"
                  value={storePrice.sell_price}
                  onChange={(e) => handleStorePriceChange(index, 'sell_price', e.target.value)}
                  className="mt-1 block w-1/2 border-gray-300 rounded-md shadow-sm"
                />
              </div>
            ))}
            <button type="button" onClick={handleAddStorePrice} className="text-blue-500">
              Add Store Price
            </button>
          </div>

          {/* Sub-Agent Prices */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Sub-Agent Prices</h3>
            {formData.sub_agent_prices.map((subAgentPrice, index) => (
              <div key={index} className="flex mb-2">
                <select
                  className="mt-1 block w-1/2 border-gray-300 rounded-md shadow-sm mr-2"
                  value={subAgentPrice.sub_agent_id}
                  onChange={(e) => handleSubAgentPriceChange(index, 'sub_agent_id', e.target.value)}
                >
                  <option value="" disabled>Select Sub-Agent</option>
                  {subAgents.map(subAgent => (
                    <option key={subAgent.id} value={subAgent.id}>{subAgent.name}</option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Sell Price"
                  value={subAgentPrice.sell_price}
                  onChange={(e) => handleSubAgentPriceChange(index, 'sell_price', e.target.value)}
                  className="mt-1 block w-1/2 border-gray-300 rounded-md shadow-sm"
                />
              </div>
            ))}
            <button type="button" onClick={handleAddSubAgentPrice} className="text-blue-500">
              Add Sub-Agent Price
            </button>
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

export default Modal;
