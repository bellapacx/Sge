import React, { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import Chart from '../components/Chart';
import StockAlert from '../components/StockAlert';
import TopSellingProducts from '../components/TopSellingProducts';
import { FaDollarSign, FaShoppingCart, FaWallet } from 'react-icons/fa';
import axios from 'axios';

interface SalesData {
  date: string;
  total: number;
}

const Dashboard: React.FC = () => {
  const [revenue, setRevenue] = useState<number>(0);
  const [income, setIncome] = useState<number>(0);
  const [purchase, setPurchase] = useState<number>(0);
  const [salesByDate, setSalesByDate] = useState<SalesData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products, sell orders, and purchase orders in parallel
        const [productsResponse, sellOrdersResponse, purchaseOrdersResponse] = await Promise.all([
          axios.get('https://sgebackend.onrender.com/api/products'),
          axios.get('https://sgebackend.onrender.com/api/sorders'),
          axios.get('https://sgebackend.onrender.com/api/porders'),
        ]);

        const products = productsResponse.data; // Store fetched products

        // Calculate revenue
        const calculatedRevenue = sellOrdersResponse.data.reduce((acc: number, order: any) => acc + (order.total_amount || 0), 0);
        setRevenue(calculatedRevenue);

        // Calculate income using fetched products
        const calculatedIncome = sellOrdersResponse.data.reduce((acc: number, order: any) => {
          if (order.product_id) {
            const product = products.find((p: any) => p._id === order.product_id._id);
            if (product && product.purchase_price) {
              const incomeFromOrder = (order.sell_price - product.purchase_price) * (order.quantity || 0);
              return acc + incomeFromOrder;
            }
          }
          return acc;
        }, 0);
        setIncome(calculatedIncome);

        // Calculate sales by date
        const salesData = sellOrdersResponse.data.reduce((acc: { [key: string]: number }, order: any) => {
          const date = new Date(order.sell_date).toLocaleDateString();
          acc[date] = (acc[date] || 0) + (order.total_amount || 0);
          return acc;
        }, {});

        const formattedSalesData = Object.entries(salesData).map(([date, total]) => ({
          date,
          total: Number(total),
        }));

        setSalesByDate(formattedSalesData);

        // Calculate total purchase cost
        const purchaseOrders = purchaseOrdersResponse.data;
        const calculatedPurchase = purchaseOrders.reduce((acc: number, order: any) => acc + (order.total_cost || 0), 0);
        setPurchase(calculatedPurchase);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData(); // Fetch data when the component mounts
  }, []);

  return (
    <div className="flex flex-col p-6 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 min-h-screen">
  {isLoading ? (
    <div className="flex justify-center items-center h-full">
      <div className="text-lg font-semibold text-gray-600">Loading...</div>
    </div>
  ) : (
    <>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <StatCard
          title="Revenue"
          value={`₦${revenue.toLocaleString()}`}
          icon={FaDollarSign}
          className="bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300 rounded-xl"
        />
        <StatCard
          title="Total Purchase"
          value={`₦${purchase.toLocaleString()}`}
          icon={FaShoppingCart}
          className="bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300 rounded-xl"
        />
        <StatCard
          title="Income"
          value={`₦${income.toLocaleString()}`}
          icon={FaWallet}
          className="bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300 rounded-xl"
        />
      </div>

      {/* Performance Overview */}
      <div className="mt-4 md:mt-8 px-2 md:px-0">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 text-center md:text-left">
          Performance Overview
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          {/* Chart Container */}
          <div className="bg-white shadow-lg rounded-xl p-4 md:p-6 transition-transform duration-300 transform hover:scale-105">
  <div className="relative" style={{ paddingTop: '56.25%' }}> {/* Aspect ratio for the chart */}
    <div className="absolute inset-0 rounded-lg overflow-hidden"> {/* Rounded corners for the chart */}
      <Chart salesData={salesByDate} />
    </div>
  </div>
</div>
          {/* Top Selling Products Container */}
          <div className="bg-white shadow-lg rounded-xl p-4 md:p-6 transition-transform duration-300 hover:scale-105">
            <TopSellingProducts />
          </div>
        </div>
      </div>

      {/* Stock Overview */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Stock Overview</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow-lg rounded-xl p-6 transition-transform duration-300 hover:scale-105">
            <StockAlert />
          </div>
        </div>
      </div>
    </>
  )}
</div>

  );
};

export default Dashboard;
