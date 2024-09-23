import StatCard from '../components/StatCard';
import Chart from '../components/Chart';
import StockAlert from '../components/StockAlert';
import TopSellingProducts from '../components/TopSellingProducts';
import { FaDollarSign, FaUndoAlt, FaShoppingCart, FaWallet } from 'react-icons/fa'; // Using FontAwesome icons

const Dashboard: React.FC = () => {
  return (
    <div className="flex flex-col p-6 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <StatCard title="Revenue" value="30,000" icon={FaDollarSign} />
        <StatCard title="Sales Return" value="30,000" icon={FaUndoAlt} />
        <StatCard title="Purchase" value="30,000" icon={FaShoppingCart} />
        <StatCard title="Income" value="30,000" icon={FaWallet} />
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
