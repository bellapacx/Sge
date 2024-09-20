import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '../components/ModalP';

interface StorePrice {
  store_id: string; // Store ID type
  sell_price: number;
}

interface SubAgentPrice {
  sub_agent_id: string; // Sub-agent ID type
  sell_price: number;
}

interface Product {
  _id: string;
  name: string;
  category: string;
  purchase_price: number;
  default_sell_price: number;
  unit: string;
  store_prices?: StorePrice[];
  sub_agent_prices?: SubAgentPrice[];
  created_at: Date;
  updated_at: Date;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://sgebackend.onrender.com/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddOrUpdateProduct = async (formData: {
    name: string;
    category: string;
    purchase_price: string;
    default_sell_price: string;
    unit: string;
    store_prices?: StorePrice[];
    sub_agent_prices?: SubAgentPrice[];
  }) => {
    try {
      if (editingProduct) {
        // Edit existing product
        await axios.put(`https://sgebackend.onrender.com/api/products/${editingProduct._id}`, formData);
      } else {
        // Add new product
        await axios.post('https://sgebackend.onrender.com/api/products', formData);
      }
      // Refresh the product list after add or update
      const response = await axios.get('https://sgebackend.onrender.com/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsModalOpen(false);
      setEditingProduct(null); // Reset editing state
    }
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    try {
      await axios.delete(`https://sgebackend.onrender.com/api/products/${id}`);
      // Refresh the product list after deletion
      setProducts(products.filter(product => product._id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div>
      <h1>Products</h1>
      <button
        onClick={() => {
          setEditingProduct(null);
          setIsModalOpen(true);
        }}
        className="mb-4 bg-gray-600 text-white px-4 py-2 rounded-md"
      >
        Add Product
      </button>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Default Sell Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map(product => (
            <tr key={product._id}>
              <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{product.category}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                ${product.purchase_price ? product.purchase_price.toFixed(2) : 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                ${product.default_sell_price ? product.default_sell_price.toFixed(2) : 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{product.unit}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => handleEditClick(product)}
                  className="ml-2 bg-gray-500 text-white px-4 py-2 rounded-md"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(product._id)}
                  className="ml-2 bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null); // Reset editing state on close
        }}
        onSubmit={handleAddOrUpdateProduct}
        initialData={editingProduct ? {
          name: editingProduct.name,
          category: editingProduct.category,
          purchase_price: editingProduct.purchase_price.toString(),
          default_sell_price: editingProduct.default_sell_price.toString(),
          unit: editingProduct.unit,
          store_prices: editingProduct.store_prices || [],
          sub_agent_prices: editingProduct.sub_agent_prices || [],
        } : {
          name: '',
          category: '',
          purchase_price: '',
          default_sell_price: '',
          unit: '',
          store_prices: [],
          sub_agent_prices: [],
        }}
      />
    </div>
  );
};

export default Products;
