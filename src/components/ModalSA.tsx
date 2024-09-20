import React, { useEffect, useState } from 'react';

interface Store {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  name: string;
  category: string;
  sell_price: number;
}

interface AssignedProduct {
  product_id: string;
  sell_price: number;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    contact_info?: string;
    assigned_stores: string[]; // Keep this as string[] for selection
    assigned_products: AssignedProduct[];
  }) => void;
  initialData: {
    name: string;
    contact_info?: string;
    assigned_stores: string[];
    assigned_products: AssignedProduct[];
  };
  stores: Store[];
  products: Product[];
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit, initialData, stores, products }) => {
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleStoreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, assigned_stores: value ? [...formData.assigned_stores, value] : [] });
  };

  const handleProductChange = (productId: string) => {
    if (productId) {
      const newProduct = { product_id: productId, sell_price: 0 }; // Default sell_price
      setFormData({ ...formData, assigned_products: [...formData.assigned_products, newProduct] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    isOpen ? (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
          <h2 className="text-xl mb-4">Add Sub-Agent</h2>
          <form onSubmit={handleSubmit}>
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
              <label className="block text-sm font-medium text-gray-700">Contact Info</label>
              <input
                type="text"
                name="contact_info"
                value={formData.contact_info}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Assigned Stores</label>
              <select onChange={handleStoreChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                <option value="">Select Store</option>
                {stores.map(store => (
                  <option key={store._id} value={store._id}>{store.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Assigned Products</label>
              <select onChange={(e) => handleProductChange(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                <option value="">Select Product</option>
                {products.map(product => (
                  <option key={product._id} value={product._id}>{product.name}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end">
              <button type="button" onClick={onClose} className="mr-2 bg-gray-500 text-white px-4 py-2 rounded-md">Cancel</button>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">Save</button>
            </div>
          </form>
        </div>
      </div>
    ) : null
  );
};

export default Modal;
