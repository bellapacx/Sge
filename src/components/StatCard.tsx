// src/components/StatCard.tsx

interface StatCardProps {
    title: string;
    value: string;
    className?: string; // Add this line
  }
  
  const StatCard: React.FC<StatCardProps> = ({ title, value }) => {
    return (
      <div className="bg-white p-4 rounded-md shadow-md flex items-center justify-between">
        <div>
          <h3 className="text-sm text-gray-500">{title}</h3>
          <p className="text-2xl font-bold">+{value}</p>
        </div>
        <div className="bg-gray-200 p-2 rounded-full">💰</div>
      </div>
    );
  };
  
  export default StatCard;
  