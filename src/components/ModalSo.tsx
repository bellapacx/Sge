import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: {
    store_id: string;
    product_id: string;
    quantity: number;
    sell_price: number; // This will be calculated dynamically
    sell_date: string;
    customer_name: string;
  }) => void;
  userStoreId: string; // userStoreId prop
}

const ModalS: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit, userStoreId }) => {
  const [formData, setFormData] = useState({
    store_id: userStoreId || '', // Initialize store_id with userStoreId
    product_id: '',
    quantity: 0,
    sell_price: 0,
    sell_date: new Date().toISOString().split('T')[0], // Default to today's date
    customer_name: '',
  });

  const [stores, setStores] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    const fetchStoresAndProducts = async () => {
      try {
        // Fetch stores and products
        const [storeResponse, productResponse] = await Promise.all([
          axios.get('https://sgebackend.onrender.com/api/stores'),
          axios.get('https://sgebackend.onrender.com/api/products'),
        ]);

        // Filter stores to include only the user's store
        const userStore = storeResponse.data.find((store: any) => store._id === userStoreId);
        setStores(userStore ? [userStore] : []);

        setProducts(productResponse.data);
      } catch (error) {
        console.error('Error fetching stores and products:', error);
      }
    };

    fetchStoresAndProducts();
  }, [userStoreId]);

  // Update store_id when userStoreId changes
  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      store_id: userStoreId,
    }));
  }, [userStoreId]);

  useEffect(() => {
    if (formData.product_id) {
      const product = products.find((p) => p._id === formData.product_id);
      if (product) {
        setSelectedProduct(product);
        setFormData((prevFormData) => ({
          ...prevFormData,
          sell_price: product.sell_price * prevFormData.quantity, // Update sell_price when product or quantity changes
        }));
      }
    } else {
      setSelectedProduct(null);
      setFormData((prevFormData) => ({
        ...prevFormData,
        sell_price: 0,
      }));
    }
  }, [formData.product_id, formData.quantity, products]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const quantity = parseInt(e.target.value, 10);
    setFormData((prevFormData) => ({
      ...prevFormData,
      quantity,
      sell_price: selectedProduct ? selectedProduct.sell_price * quantity : 0,
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Add Sell Order</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="store_id" className="block text-sm font-medium text-gray-700">
              Store
            </label>
            <select
              id="store_id"
              name="store_id"
              value={formData.store_id}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              disabled
            >
              <option value={userStoreId}>
                {stores.length > 0 ? stores[0].name : 'Loading...'}
              </option>
            </select>
          </div>
          <div>
            <label htmlFor="product_id" className="block text-sm font-medium text-gray-700">
              Product
            </label>
            <select
              id="product_id"
              name="product_id"
              value={formData.product_id}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Product</option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={handleQuantityChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="sell_date" className="block text-sm font-medium text-gray-700">
              Sell Date
            </label>
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
            <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700">
              Customer Name
            </label>
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
            <label htmlFor="sell_price" className="block text-sm font-medium text-gray-700">
              Sell Price
            </label>
            <input
              type="number"
              id="sell_price"
              name="sell_price"
              value={formData.sell_price}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded-md">
            Submit
          </button>
          <button onClick={onClose} className="bg-gray-300 text-black px-4 py-2 rounded-md">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalS;
