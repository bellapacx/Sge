import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '../components/ModalSA';

interface Store {
  _id: string;
  name: string;
}

interface SubAgent {
  _id?: string;
  name: string;
  contact_info?: string;
  assigned_stores: Store[];
}

const SubAgents: React.FC = () => {
  const [subAgents, setSubAgents] = useState<SubAgent[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubAgent, setEditingSubAgent] = useState<SubAgent | null>(null);

  useEffect(() => {
    const fetchSubAgents = async () => {
      const response = await axios.get('https://sgebackend.onrender.com/api/subagent');
      setSubAgents(response.data);
    };

    const fetchStores = async () => {
      const response = await axios.get('https://sgebackend.onrender.com/api/stores');
      setStores(response.data);
    };

    fetchSubAgents();
    fetchStores();
  }, []);

  const handleAddOrUpdateSubAgent = async (formData: {
    name: string;
    contact_info?: string;
    assigned_stores: string[]; // Keep this as string[] for selection
  }) => {
    try {
      const dataToSubmit: SubAgent = {
        name: formData.name,
        contact_info: formData.contact_info,
        assigned_stores: stores.filter(store => formData.assigned_stores.includes(store._id)), // Convert to Store[]
      };

      if (editingSubAgent) {
        await axios.put(`https://sgebackend.onrender.com/api/subagent/${editingSubAgent._id}`, dataToSubmit);
      } else {
        await axios.post('https://sgebackend.onrender.com/api/subagent', dataToSubmit);
      }
      const response = await axios.get('https://sgebackend.onrender.com/api/subagent');
      setSubAgents(response.data);
    } catch (error) {
      console.error('Error saving subagent:', error);
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
      await axios.delete(`https://sgebackend.onrender.com/api/subagent/${id}`);
      setSubAgents((prev) => prev.filter((subAgent) => subAgent._id !== id));
    } catch (error) {
      console.error('Error deleting subagent:', error);
    }
  };

  return (
    <div className="p-4">
  <h1 className="text-2xl font-bold mb-4">Sub Agents</h1>
  <button
    onClick={() => {
      setEditingSubAgent(null);
      setIsModalOpen(true);
    }}
    className="mb-4 bg-gray-600 text-white px-4 py-2 rounded-md"
  >
    Add Sub-Agent
  </button>
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Info</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Stores</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {subAgents.map((subAgent) => (
          <tr key={subAgent._id}>
            <td className="px-4 py-4 whitespace-nowrap">{subAgent.name}</td>
            <td className="px-4 py-4 whitespace-nowrap">{subAgent.contact_info || 'N/A'}</td>
            <td className="px-4 py-4 whitespace-nowrap">
              {subAgent.assigned_stores.map(store => store.name).join(', ')}
            </td>
            <td className="px-4 py-4 whitespace-nowrap">
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
  </div>
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
    } : {
      name: '',
      contact_info: '',
      assigned_stores: [],
    }}
    stores={stores}
  />
</div>

  );
};

export default SubAgents;
