import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '../components/userModal'; // Assume you have this Modal component

interface User {
  _id: string;
  username: string;
  phone_number: string;
  role: string;
  store_id: string;
}

interface Store {
  _id: string;
  name: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
      
        const token = localStorage.getItem('authToken');
        const response = await fetch('https://sgebackend.onrender.com/api/users', {
            method: 'GET',                  
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            // Ensure cookies are sent with the request
        });
        if (response.ok) {
            const data = await response.json();
            setUsers(data);
        } else {
            throw new Error('Failed to fetch user data');
        }
       
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchStores = async () => {
      try {
        const response = await axios.get('https://sgebackend.onrender.com/api/stores');
        setStores(response.data);
      } catch (error) {
        console.error('Error fetching stores:', error);
      }
    };

    fetchUsers();
    fetchStores();
  }, []);

  const handleAddOrUpdateUser = async (formData: {
    username: string;
    phone_number: string;
    role: string;
    store_id: string;
    password: string;
  }) => {
    try {
      if (editingUser) {
        // Edit existing user
        await axios.put(`https://sgebackend.onrender.com/api/users/${editingUser._id}`, formData);
      } else {
        // Add new user
        await axios.post('https://sgebackend.onrender.com/api/register', formData);
      }
      // Refresh the user list after add or update
      const token = localStorage.getItem('authToken');
        const response = await fetch('https://sgebackend.onrender.com/api/users', {
            method: 'GET',                  
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            // Ensure cookies are sent with the request
        });
        if (response.ok) {
            const data = await response.json();
            setUsers(data);
        } else {
            throw new Error('Failed to fetch user data');
        }
      
    } catch (error) {
      console.error('Error saving user:', error);
    } finally {
      setIsModalOpen(false);
      setEditingUser(null); // Reset editing state
    }
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  return (
    <div className="p-4">
    <h1 className="text-2xl font-bold mb-4">Users</h1>
    <button
      onClick={() => {
        setEditingUser(null);
        setIsModalOpen(true);
      }}
      className="mb-4 bg-gray-600 text-white px-4 py-2 rounded-md transition duration-200 hover:bg-gray-500"
    >
      Add User
    </button>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
            <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
            <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store</th>
            <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Array.isArray(users) && users.length > 0 ? (
            users.map((user) => (
              <tr key={user._id}>
                <td className="px-2 py-4 whitespace-nowrap text-sm">{user.username}</td>
                <td className="px-2 py-4 whitespace-nowrap text-sm">{user.phone_number}</td>
                <td className="px-2 py-4 whitespace-nowrap text-sm">{user.role}</td>
                <td className="px-2 py-4 whitespace-nowrap text-sm">
                  {stores.find((store) => store._id === user.store_id)?.name || 'N/A'}
                </td>
                <td className="px-2 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => handleEditClick(user)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-md text-sm transition duration-200 hover:bg-yellow-400"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="px-4 py-4 text-center text-gray-500">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    <Modal
      isOpen={isModalOpen}
      onClose={() => {
        setIsModalOpen(false);
        setEditingUser(null); // Reset editing state on close
      }}
      onSubmit={handleAddOrUpdateUser}
      stores={stores} // Passing stores to the modal for the dropdown
      initialData={editingUser ? {
        username: editingUser.username,
        phone_number: editingUser.phone_number,
        role: editingUser.role,
        store_id: editingUser.store_id,
        password: '', // Password field, left empty for editing
      } : {
        username: '',
        phone_number: '',
        role: '',
        store_id: '',
        password: '', // Password field for new user
      }}
    />
  </div>
  

  );
};

export default Users;
