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
  const [products, setProducts] = useState<any[]>([]); // Added products state

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://sgebackend.onrender.com/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchSellOrders = async () => {
      try {
        const response = await axios.get('https://sgebackend.onrender.com/api/sorders');
        const sellOrders = response.data;
    
        const calculatedRevenue = sellOrders.reduce((acc: number, order: any) => acc + (order.total_amount || 0), 0);
        setRevenue(calculatedRevenue);
    
        // Calculate income using product purchase prices
        const calculatedIncome = sellOrders.reduce((acc: number, order: any) => {
          const product = products.find((p) => p._id === order.product_id._id); // Find the product by ID
          if (product && product.purchase_price) { // Check if product exists and has a purchase price
            const incomeFromOrder = (order.sell_price - product.purchase_price) * (order.quantity || 0);
            return acc + incomeFromOrder; // Only add if product is found
          }
          return acc; // If no product or no purchase price, return current accumulator
        }, 0);
    
        setIncome(calculatedIncome);
    
        // Calculate sales by date
        const salesData = sellOrders.reduce((acc: { [key: string]: number }, order: any) => {
          const date = new Date(order.sell_date).toLocaleDateString();
          acc[date] = (acc[date] || 0) + (order.total_amount || 0);
          return acc;
        }, {});
    
        const formattedSalesData = Object.entries(salesData).map(([date, total]) => ({
          date,
          total: Number(total),
        }));
    
        setSalesByDate(formattedSalesData);
    
      } catch (error) {
        console.error("Error fetching sell orders:", error);
      }
    };
    
    const fetchPurchaseOrders = async () => {
      try {
        const response = await axios.get('https://sgebackend.onrender.com/api/porders');
        const purchaseOrders = response.data;

        const calculatedPurchase = purchaseOrders.reduce((acc: number, order: any) => acc + (order.total_cost || 0), 0);
        setPurchase(calculatedPurchase);
      } catch (error) {
        console.error("Error fetching purchase orders:", error);
      }
    };

    fetchProducts(); // Fetch products
    fetchSellOrders();
    fetchPurchaseOrders();
  }, []);

  return (
    <div className="flex flex-col p-6 bg-gray-50 min-h-screen">
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
          <div className="bg-white shadow-md rounded-lg p-6">
            <TopSellingProducts />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
