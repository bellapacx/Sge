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
    <div className="flex flex-col p-6 bg-gray-50 min-h-screen">
      {isLoading ? <p>Loading...</p> : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            <StatCard title="Revenue" value={`₦${revenue.toLocaleString()}`} icon={FaDollarSign} />
            <StatCard title="Total Purchase" value={`₦${purchase.toLocaleString()}`} icon={FaShoppingCart} />
            <StatCard title="Income" value={`₦${income.toLocaleString()}`} icon={FaWallet} />
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Performance Overview</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white shadow-md rounded-lg p-6">
                <Chart salesData={salesByDate} />
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
             
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
