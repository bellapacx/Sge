import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ModalP from '../components/ModalPo'; // Ensure this matches the actual file name

interface Product {
  _id: string;
  name: string;
  category: string;
  purchase_price: number;
}

interface Store {
  _id: string;
  name: string;
  location: string;
}

interface PurchaseOrder {
  _id: string;
  store_id: Store; // store_id is an object, not a string
  product_id: Product;
  quantity: number;
  supplier: string;
  purchase_date: Date;
  total_cost: number;
  created_at: Date;
  status: 'pending' | 'accepted';
}

const PurchaseOrders: React.FC = () => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState<{
    _id?: string;
    store_id: string;
    product_id: string;
    quantity: number;
    supplier: string;
    purchase_date: string;
    total_cost: number;
  } | null>(null);
  const [userStoreId, setUserStoreId] = useState<string | null>(null); // Store ID from current user
  const [isAdmin, setIsAdmin] = useState(false); // User role status

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('https://sgebackend.onrender.com/api/current-user', {
            method: 'GET',                  
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            // Ensure cookies are sent with the request
        });
        if (response.ok) {
            const data = await response.json();
            setUserStoreId(data.store_id); // Get store_id from current user
            setIsAdmin(data.role === 'admin');
        } else {
            throw new Error('Failed to fetch user data');
        }
        // Check if user is admin
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchPurchaseOrders = async () => {
      try {
        const response = await axios.get('https://sgebackend.onrender.com/api/porders');
        const orders = response.data;
    
        // Filter orders based on role
        const filteredOrders = isAdmin
          ? orders
          : orders.filter((order: PurchaseOrder) => 
              order.store_id && order.store_id._id === userStoreId
            );
    
        // Sort orders by 'created_at' in descending order
        const sortedOrders = filteredOrders.sort(
          (a: PurchaseOrder, b: PurchaseOrder) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    
        setPurchaseOrders(sortedOrders);
      } catch (error) {
        console.error('Error fetching purchase orders:', error);
      }
    };
    
    fetchPurchaseOrders();
  }, [userStoreId, isAdmin]);

  const handleAddPurchaseOrder = async (formData: {
    store_id: string;
    product_id: string;
    quantity: number;
    supplier: string;
    purchase_date: string;
    total_cost: number;
  }) => {
    try {
      const selectedProduct = await axios.get(`https://sgebackend.onrender.com/api/products/${formData.product_id}`);
      const product = selectedProduct.data as Product;

      const totalCost = product.purchase_price * formData.quantity;

      const dataToSubmit = {
        ...formData,
        total_cost: totalCost,
      };

      await axios.post('https://sgebackend.onrender.com/api/porders', dataToSubmit);
      await refreshPurchaseOrders();
    } catch (error) {
      console.error('Error adding purchase order:', error);
    } finally {
      setIsModalOpen(false);
      setSelectedPO(null);
    }
  };

  const handleUpdatePurchaseOrder = async (formData: {
    store_id: string;
    product_id: string;
    quantity: number;
    supplier: string;
    purchase_date: string;
    total_cost: number;
  }) => {
    try {
      if (!selectedPO?._id) {
        console.error('No purchase order selected for update');
        return;
      }

      // Fetch the current purchase order
      const purchaseOrderResponse = await axios.get(`https://sgebackend.onrender.com/api/porders/${selectedPO._id}`);
      // @ts-ignore
      const purchaseOrder = purchaseOrderResponse.data as PurchaseOrder;

      // Fetch the product details
      const selectedProductResponse = await axios.get(`https://sgebackend.onrender.com/api/products/${formData.product_id}`);
      const product = selectedProductResponse.data as Product;

      // Calculate the total cost
      const totalCost = product.purchase_price * formData.quantity;

      // Prepare the data to submit
      const dataToSubmit = {
        store_id: formData.store_id,
        product_id: formData.product_id,
        quantity: formData.quantity,
        supplier: formData.supplier,
        purchase_date: formData.purchase_date,
        total_cost: totalCost,
      };

      // Update the purchase order
      await axios.put(`https://sgebackend.onrender.com/api/porders/${selectedPO._id}`, dataToSubmit);
      await refreshPurchaseOrders();
    } catch (error) {
      console.error('Error updating purchase order:', error);
    } finally {
      setIsModalOpen(false);
      setSelectedPO(null);
    }
  };

  const handleAcceptPurchaseOrder = async (id: string) => {
    try {
      // Fetch the purchase order to get its quantity
      const response = await axios.get(`https://sgebackend.onrender.com/api/porders/${id}`);
      const po = response.data as PurchaseOrder;

      const acceptedQuantity = prompt('Enter the accepted quantity:');
      
      if (!acceptedQuantity || isNaN(Number(acceptedQuantity))) {
        alert('Invalid quantity');
        return;
      }

      const acceptedQty = Number(acceptedQuantity);

      if (acceptedQty > po.quantity) {
        alert('Accepted quantity cannot be greater than the ordered quantity.');
        return;
      }

      await axios.put(`https://sgebackend.onrender.com/api/porders/${id}/accept`, {
        accepted_quantity: acceptedQty,
      });
       
      const storeid = userStoreId ?? '';
      // Call the updateEmptyCrates function to update inventory
      await updateEmptyCrates(storeid, po.product_id._id, acceptedQty);

      await refreshPurchaseOrders();
    } catch (error) {
      console.error('Error accepting purchase order:', error);
    }
  };

  const handleEditPurchaseOrder = async (id: string) => {
    try {
      const response = await axios.get(`https://sgebackend.onrender.com/api/porders/${id}`);
      const po = response.data as PurchaseOrder;

      const purchaseDate = new Date(po.purchase_date);

      setSelectedPO({
        _id: po._id,
        store_id: po.store_id._id,
        product_id: po.product_id._id,
        quantity: po.quantity,
        supplier: po.supplier,
        purchase_date: purchaseDate.toISOString().split('T')[0],
        total_cost: po.total_cost,
      });

      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching purchase order:', error);
    }
  };

  const updateEmptyCrates = async (userStoreId: string, productId: string, quantity: number) => {
    try {
      let emptyCrates;
      console.log(productId);
      try {
        // Fetch current inventory for the store
        const response = await axios.get(`https://sgebackend.onrender.com/api/emptycrates/${userStoreId}`);
        emptyCrates = response.data;

        // Check if the inventory is empty or not found
         if (!emptyCrates.inventory || emptyCrates.inventory.length === 0) {
       // Initialize or update emptyCrates with default values
         emptyCrates = {
        store_id: userStoreId,
         inventory: [{ product_id: productId, quantity: -quantity }], // Add the product to the inventory
      created_at: emptyCrates.created_at || new Date(),
      updated_at: new Date(),
    };
     
     
    // If the record was found but inventory is empty, update it using PUT
    await axios.put(`https://sgebackend.onrender.com/api/emptycrates/${userStoreId}`, {
      inventory: emptyCrates.inventory,
      updated_at: new Date(),
    });

          // POST to create a new empty crates entry
          await axios.post('https://sgebackend.onrender.com/api/emptycrates', {
            store_id: userStoreId,
            inventory: [{ product_id: productId, quantity: -quantity }],
          });

          console.log('Created new empty crates entry');
          return;
        }
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          // Handle the case where no empty crates document is found
          emptyCrates = {
            store_id: userStoreId,
            inventory: [],
            created_at: new Date(),
            updated_at: new Date(),
          };

          // POST to create a new empty crates entry
          await axios.post('https://sgebackend.onrender.com/api/emptycrates', {
            store_id: userStoreId,
            inventory: [{ product_id: productId, quantity: -quantity }],
          });

          console.log('Created new empty crates entry');
          return;
        } else {
          // Handle other errors
          throw err;
        }
      }

      // Subtract quantity for the existing product
      const existingProductIndex = emptyCrates.inventory.findIndex(
        (item: { product_id: string }) => item.product_id === productId
      );
      if (existingProductIndex >= 0) {
        emptyCrates.inventory[existingProductIndex].quantity -= quantity;
      } else {
        // Add new product entry with negative quantity
        emptyCrates.inventory.push({ product_id: productId, quantity: -quantity });
      }

      // PUT to update the existing empty crates entry in the database
      await axios.put(`https://sgebackend.onrender.com/api/emptycrates/${userStoreId}`, {
        inventory: emptyCrates.inventory,
        updated_at: new Date(),
      });

      console.log('Updated empty crates entry');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        // Handle specific Axios errors
        console.error('Error updating empty crates:', err.response?.data || err.message);
      } else {
        // Handle general errors
        console.error('Unexpected error:', err);
      }
    }
  };

  const refreshPurchaseOrders = async () => {
    try {
      const response = await axios.get('https://sgebackend.onrender.com/api/porders');
      const orders = response.data;
    
      // Filter orders based on role
      const filteredOrders = isAdmin
        ? orders
        : orders.filter((order: PurchaseOrder) => 
            order.store_id && order.store_id._id === userStoreId
          );
    
      // Sort orders by 'created_at' in descending order
      const sortedOrders = filteredOrders.sort(
        (a: PurchaseOrder, b: PurchaseOrder) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    
      setPurchaseOrders(sortedOrders);
    } catch (error) {
      console.error('Error refreshing purchase orders:', error);
    }
  };

  return (
    <div>
      <h1 className='mb-2'>Purchase Orders</h1>
      {isAdmin && (
      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-4 bg-gray-600 text-white px-4 py-2 rounded-md"
      >
        Add Purchase Order
      </button>
    )}
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Table Header */}
          <table className="divide-y divide-gray-200 w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Date</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
          </table>
          
          {/* Table Body */}
          <div className="max-h-96 overflow-y-auto bg-white">
            <table className="divide-y divide-gray-200 w-full">
              <tbody>
                {purchaseOrders.map((po) => (
                  <tr key={po._id}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {po.store_id ? po.store_id.name : 'No Store'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                    {po.product_id ? po.product_id.name : 'N/A'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{po.quantity}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{po.supplier}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{new Date(po.purchase_date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 whitespace-nowrap">${po.total_cost.toFixed(2)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{po.status}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {po.status === 'pending' && (
                        <button
                          onClick={() => handleAcceptPurchaseOrder(po._id)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md"
                        >
                          Accept
                        </button>
                      )}
                      {isAdmin && (
                      <button
                        onClick={() => handleEditPurchaseOrder(po._id)}
                        className="ml-2 bg-yellow-500 text-white px-4 py-2 rounded-md"
                      >
                        Edit
                      </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ModalP
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPO(null);
        }}
        onSubmit={selectedPO ? handleUpdatePurchaseOrder : handleAddPurchaseOrder}
        initialData={selectedPO ? {
          store_id: selectedPO.store_id,
          product_id: selectedPO.product_id,
          quantity: selectedPO.quantity,
          supplier: selectedPO.supplier,
          purchase_date: selectedPO.purchase_date,
          total_cost: selectedPO.total_cost,
        } : undefined}
      />
    </div>
  );
};

export default PurchaseOrders;
