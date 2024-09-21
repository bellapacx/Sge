import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface SellOrder {
  _id: string;
  store_id: { _id: string, name: string };
  product_id: { _id: string, name: string };
  quantity: number;
  sell_price: number;
  sell_date: Date;
  customer_name: string;
}

interface Store {
  _id: string;
  name: string;
}

const SellReports: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [reportDate, setReportDate] = useState<string>('');
  const [reportData, setReportData] = useState<{
    quantity_sold: number;
    total_revenue: number;
    sell_orders: SellOrder[];
  }>({
    quantity_sold: 0,
    total_revenue: 0,
    sell_orders: []
  });

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get('https://sgebackend.onrender.com/api/stores');
        setStores(response.data);
      } catch (error) {
        console.error('Error fetching stores:', error);
      }
    };

    fetchStores();
  }, []);

  const handleFetchReport = async () => {
    try {
      if (selectedStore && reportDate) {
        const response = await axios.get('https://sgebackend.onrender.com/api/sell-reports', {
          params: {
            store_id: selectedStore,
            sell_date: reportDate
          }
        });
        const fetchedSellOrders = response.data;

        setReportData(fetchedSellOrders);
      }
    } catch (error) {
      console.error('Error fetching report:', error);
    }
  };

  return (
<div className="p-4">
  <h1 className="text-2xl font-bold mb-4">Sell Reports</h1>
  
  <div className="mb-4">
    <label htmlFor="store" className="block text-sm font-medium text-gray-700">
      Select Store
    </label>
    <select
      id="store"
      value={selectedStore || ''}
      onChange={(e) => setSelectedStore(e.target.value)}
      className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm p-2 text-sm"
    >
      <option value="">Select a store</option>
      {stores.map(store => (
        <option key={store._id} value={store._id}>
          {store.name}
        </option>
      ))}
    </select>
  </div>
  
  <div className="mb-4">
    <label htmlFor="reportDate" className="block text-sm font-medium text-gray-700">
      Report Date
    </label>
    <input
      id="reportDate"
      type="date"
      value={reportDate}
      onChange={(e) => setReportDate(e.target.value)}
      className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm p-2 text-sm"
    />
  </div>
  
  <button
    onClick={handleFetchReport}
    className="mb-4 bg-gray-600 text-white px-4 py-2 rounded-md text-sm sm:text-base"
  >
    Generate Report
  </button>
  
  {reportData && (
    <div>
      <h2 className="text-xl text-black font-bold mb-2">Report Summary</h2>
      <p className='text-black'><strong>Store:</strong> {reportData.sell_orders[0]?.store_id.name}</p>
      <p className='text-black'><strong>Quantity Sold:</strong> {reportData.quantity_sold}</p>
      <p className='text-black'><strong>Total Revenue:</strong> ${reportData.total_revenue.toFixed(2)}</p>
      
      <h3 className="text-lg font-semibold mt-4">Sell Orders</h3>
      
      {/* Responsive Table for Larger Screens */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sell Price</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sell Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reportData.sell_orders.map(order => (
              <tr key={order._id}>
                <td className="px-4 py-4 whitespace-nowrap">{order.product_id.name}</td>
                <td className="px-4 py-4 whitespace-nowrap">{order.quantity}</td>
                <td className="px-4 py-4 whitespace-nowrap">${order.sell_price.toFixed(2)}</td>
                <td className="px-4 py-4 whitespace-nowrap">{new Date(order.sell_date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Card Layout for Mobile Screens */}
      <div className="md:hidden">
        {reportData.sell_orders.map(order => (
          <div key={order._id} className="mb-4 p-4 border border-gray-300 rounded-md shadow-sm">
            <h4 className="font-bold">Product: {order.product_id.name}</h4>
            <p><strong>Quantity:</strong> {order.quantity}</p>
            <p><strong>Sell Price:</strong> ${order.sell_price.toFixed(2)}</p>
            <p><strong>Sell Date:</strong> {new Date(order.sell_date).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  )}
</div>


  );
};

export default SellReports;
