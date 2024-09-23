import React, { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import Chart from '../components/Chart';
import StockAlert from '../components/StockAlert';
import TopSellingProducts from '../components/TopSellingProducts';
import { FaDollarSign,  FaShoppingCart, FaWallet } from 'react-icons/fa';
import axios from 'axios';

const Dashboard: React.FC = () => {
  const [revenue, setRevenue] = useState<number>(0);
  const [income, setIncome] = useState<number>(0);
  const [purchase, setPurchase] = useState<number>(0);

  useEffect(() => {
    const fetchSellOrders = async () => {
      try {
        const response = await axios.get('https://sgebackend.onrender.com/api/sorders'); // Adjust endpoint as necessary
        const sellOrders = response.data;

        const calculatedRevenue = sellOrders.reduce((acc: number, order: any) => acc + order.total_amount, 0);
        const calculatedIncome = sellOrders.reduce((acc: number, order: any) => acc + order.sell_price * order.quantity, 0);

        setRevenue(calculatedRevenue);
        setIncome(calculatedIncome);
      } catch (error) {
        console.error("Error fetching sell orders:", error);
      }
    };

    const fetchPurchaseOrders = async () => {
      try {
        const response = await axios.get('https://sgebackend.onrender.com/api/porders'); // Adjust endpoint as necessary
        const purchaseOrders = response.data;

        const calculatedPurchase = purchaseOrders.reduce((acc: number, order: any) => acc + order.total_cost, 0);

        setPurchase(calculatedPurchase);
      } catch (error) {
        console.error("Error fetching purchase orders:", error);
      }
    };

    fetchSellOrders();
    fetchPurchaseOrders();
  }, []);

  return (
    <div className="flex flex-col p-6 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <StatCard title="Revenue" value={`₦${revenue.toLocaleString()}`} icon={FaDollarSign} />

        <StatCard title="Purchase" value={`₦${purchase.toLocaleString()}`} icon={FaShoppingCart} />
        <StatCard title="Income" value={`₦${income.toLocaleString()}`} icon={FaWallet} />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Performance Overview</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow-md rounded-lg p-6">
            <Chart />
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <TopSellingProducts />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Stock Overview</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow-md rounded-lg p-6">
            <StockAlert />
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <TopSellingProducts />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
