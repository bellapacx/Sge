import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '../components/ModalSA';

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

interface SubAgent {
  _id?: string;
  name: string;
  contact_info?: string;
  assigned_stores: Store[];
  assigned_products: AssignedProduct[];
}

const SubAgents: React.FC = () => {
  const [subAgents, setSubAgents] = useState<SubAgent[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubAgent, setEditingSubAgent] = useState<SubAgent | null>(null);

  useEffect(() => {
    const fetchSubAgents = async () => {
      const response = await axios.get('https://sgebackend.onrender.com/api/subagents');
      setSubAgents(response.data);
    };

    const fetchStores = async () => {
      const response = await axios.get('https://sgebackend.onrender.com/api/stores');
      setStores(response.data);
    };

    const fetchProducts = async () => {
      const response = await axios.get('https://sgebackend.onrender.com/api/products');
      setProducts(response.data);
    };

    fetchSubAgents();
    fetchStores();
    fetchProducts();
  }, []);

  const handleAddOrUpdateSubAgent = async (formData: {
    name: string;
    contact_info?: string;
    assigned_stores: string[]; // Keep this as string[] for selection
    assigned_products: AssignedProduct[];
  }) => {
    try {
      const dataToSubmit: SubAgent = {
        name: formData.name,
        contact_info: formData.contact_info,
        assigned_stores: stores.filter(store => formData.assigned_stores.includes(store._id)), // Convert to Store[]
        assigned_products: formData.assigned_products,
      };

      if (editingSubAgent) {
        await axios.put(`https://sgebackend.onrender.com/api/subagents/${editingSubAgent._id}`, dataToSubmit);
      } else {
        await axios.post('https://sgebackend.onrender.com/api/subagents', dataToSubmit);
      }
      const response = await axios.get('https://sgebackend.onrender.com/api/subagents');
      setSubAgents(response.data);
    } catch (error) {
      console.error('Error saving sub-agent:', error);
    } finally {
      setIsModalOpen(false);
      setEditingSubAgent(null);
    }
  };

  const handleEditClick = (subAgent: SubAgent) => {
    setEditingSubAgent(subAgent);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    try {
      await axios.delete(`https://sgebackend.onrender.com/api/subagents/${id}`);
      setSubAgents((prev) => prev.filter((subAgent) => subAgent._id !== id));
    } catch (error) {
      console.error('Error deleting sub-agent:', error);
    }
  };

  return (
    <div>
      <h1>Sub Agents</h1>
      <button
        onClick={() => {
          setEditingSubAgent(null);
          setIsModalOpen(true);
        }}
        className="mb-4 bg-gray-600 text-white px-4 py-2 rounded-md"
      >
        Add Sub-Agent
      </button>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th>Name</th>
            <th>Contact Info</th>
            <th>Assigned Stores</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {subAgents.map((subAgent) => (
            <tr key={subAgent._id}>
              <td>{subAgent.name}</td>
              <td>{subAgent.contact_info || 'N/A'}</td>
              <td>{subAgent.assigned_stores.map(store => store.name).join(', ')}</td>
              <td>
                <button onClick={() => handleEditClick(subAgent)} className="ml-2 bg-gray-500 text-white px-4 py-2 rounded-md">
                  Edit
                </button>
                <button onClick={() => handleDeleteClick(subAgent._id!)} className="ml-2 bg-red-500 text-white px-4 py-2 rounded-md">
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
          setEditingSubAgent(null);
        }}
        onSubmit={handleAddOrUpdateSubAgent}
        initialData={editingSubAgent ? {
          name: editingSubAgent.name,
          contact_info: editingSubAgent.contact_info,
          assigned_stores: editingSubAgent.assigned_stores.map(store => store._id),
          assigned_products: editingSubAgent.assigned_products.map(product => ({
            product_id: product.product_id,
            sell_price: product.sell_price,
          })),
        } : {
          name: '',
          contact_info: '',
          assigned_stores: [],
          assigned_products: [],
        }}
        stores={stores}
        products={products}
      />
    </div>
  );
};

export default SubAgents;
