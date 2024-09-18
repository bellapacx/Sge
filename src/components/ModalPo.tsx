import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
}

interface Store {
  _id: string;
  name: string;
  location: string;
}

interface Vehicle {
  _id: string;
  driverName: string;
  plateNumber: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: {
    store_id: string;
    product_id: string;
    quantity: number;
    supplier: string;
    purchase_date: string;
    total_cost: number;
  }) => void;
  initialData?: {
    _id?: string;
    store_id: string;
    product_id: string;
    quantity: number;
    supplier: string;
    purchase_date: string;
    total_cost: number;
  };
}

const ModalP: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    store_id: '',
    product_id: '',
    quantity: 0,
    supplier: '',
    purchase_date: new Date().toISOString().split('T')[0],
    total_cost: 0,
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  // Fix the type issue while keeping the @ts-ignore comment for fallback
  const [_selectedStore, setSelectedStore] = useState<Store | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await axios.get('https://sgebackend.onrender.com/api/products');
        const storeResponse = await axios.get('https://sgebackend.onrender.com/api/stores');
        const vehicleResponse = await axios.get('https://sgebackend.onrender.com/api/vehicles'); // Fetch vehicles
        setProducts(productResponse.data);
        setStores(storeResponse.data);
        setVehicles(vehicleResponse.data); // Set vehicles data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        store_id: initialData.store_id || '',
        product_id: initialData.product_id || '',
        quantity: initialData.quantity || 0,
        supplier: initialData.supplier || '',
        purchase_date: initialData.purchase_date || new Date().toISOString().split('T')[0],
        total_cost: initialData.total_cost || 0,
      });

      if (initialData.product_id) {
        const product = products.find((p) => p._id === initialData.product_id);
        setSelectedProduct(product || null);
      }

      if (initialData.store_id) {
        const store = stores.find((s) => s._id === initialData.store_id);
        setSelectedStore(store || null);
      }
    }
  }, [initialData, products, stores]);

  useEffect(() => {
    if (selectedProduct) {
      setFormData((prevData) => ({
        ...prevData,
        total_cost: selectedProduct.price * (prevData.quantity || 0),
      }));
    }
  }, [selectedProduct, formData.quantity]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const parsedValue = name === 'quantity' || name === 'total_cost' ? Number(value) : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: parsedValue,
    }));

    if (name === 'product_id') {
      const product = products.find((p) => p._id === value);
      setSelectedProduct(product || null);
    } else if (name === 'store_id') {
      const store = stores.find((s) => s._id === value);
      setSelectedStore(store || null);
    }
  };

  const handleSubmit = () => {
    const dataToSubmit = {
      ...formData,
      quantity: Number(formData.quantity),
      total_cost: Number(formData.total_cost),
    };

    onSubmit(dataToSubmit);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md shadow-lg max-w-md w-full">
        <h2 className="text-lg font-semibold mb-4">Add Purchase Order</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Store</label>
            <select
              name="store_id"
              value={formData.store_id}
              onChange={handleChange}
              className="block w-full border border-gray-300 rounded-md shadow-sm"
            >
              <option value="">Select Store</option>
              {stores.map((store) => (
                <option key={store._id} value={store._id}>
                  {store.name} - {store.location}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
            <select
              name="product_id"
              value={formData.product_id}
              onChange={handleChange}
              className="block w-full border border-gray-300 rounded-md shadow-sm"
            >
              <option value="">Select Product</option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name} ({product.category})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={formData.quantity || ''}
              onChange={handleChange}
              className="block w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
            <select
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              className="block w-full border border-gray-300 rounded-md shadow-sm"
            >
              <option value="">Select Vehicle</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle._id} value={vehicle.plateNumber}>
                  {vehicle.driverName} - {vehicle.plateNumber}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
            <input
              type="date"
              name="purchase_date"
              value={formData.purchase_date}
              onChange={handleChange}
              className="block w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Cost</label>
            <input
              type="number"
              name="total_cost"
              placeholder="Total Cost"
              value={formData.total_cost || ''}
              onChange={handleChange}
              className="block w-full border border-gray-300 rounded-md shadow-sm"
              readOnly
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-2">
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

export default ModalP;
