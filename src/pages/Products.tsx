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
    <div className="p-4">
    <h1 className="text-2xl font-bold mb-4">Product</h1>
    <button
      onClick={() => {
        setEditingProduct(null);
        setIsModalOpen(true);
      }}
      className="mb-4 bg-gray-600 text-white px-4 py-2 rounded-md text-sm sm:text-base"
    >
      Add Product
    </button>
  
    <div className="hidden md:block overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Price</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Default Sell Price</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map(product => (
            <tr key={product._id}>
              <td className="px-4 py-4 whitespace-nowrap text-sm">{product.name}</td>
              <td className="px-4 py-4 whitespace-nowrap text-sm">{product.category}</td>
              <td className="px-4 py-4 whitespace-nowrap text-sm">
                ${product.purchase_price ? product.purchase_price.toFixed(2) : 'N/A'}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm">
                ${product.default_sell_price ? product.default_sell_price.toFixed(2) : 'N/A'}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm">{product.unit}</td>
              <td className="px-4 py-4 whitespace-nowrap text-sm">
                <button
                  onClick={() => handleEditClick(product)}
                  className="ml-2 bg-gray-500 text-white px-2 py-1 rounded-md text-xs sm:text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(product._id)}
                  className="ml-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs sm:text-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  
    {/* Responsive Card View for Mobile */}
    <div className="md:hidden">
      {products.map(product => (
        <div key={product._id} className="mb-4 p-4 border border-gray-300 rounded-md shadow-sm">
          <h2 className="text-lg font-bold">{product.name}</h2>
          <p><strong>Category:</strong> {product.category}</p>
          <p><strong>Purchase Price:</strong> ${product.purchase_price ? product.purchase_price.toFixed(2) : 'N/A'}</p>
          <p><strong>Default Sell Price:</strong> ${product.default_sell_price ? product.default_sell_price.toFixed(2) : 'N/A'}</p>
          <p><strong>Unit:</strong> {product.unit}</p>
          <div className="mt-2">
            <button
              onClick={() => handleEditClick(product)}
              className="bg-gray-500 text-white px-4 py-1 rounded-md text-xs"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteClick(product._id)}
              className="ml-2 bg-red-500 text-white px-4 py-1 rounded-md text-xs"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  
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
