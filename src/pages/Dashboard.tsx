// src/components/Dashboard.tsx
import StatCard from '../components/StatCard';
import Chart from '../components/Chart';
import StockAlert from '../components/StockAlert';
import TopSellingProducts from '../components/TopSellingProducts';

const Dashboard: React.FC = () => {
  return (
    <div className="flex">
      <div className="flex-1 p-4">
          
        <div className="grid grid-cols-4 gap-4 mt-4">
          <StatCard title="Revenue" value="30,000" />
          <StatCard title="Sales Return" value="30,000" />
          <StatCard title="Purchase" value="30,000" />
          <StatCard title="Income" value="30,000" />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Chart />
          <TopSellingProducts />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <StockAlert />
          <TopSellingProducts />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
