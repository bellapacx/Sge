import { FC } from 'react';
import { IconType } from 'react-icons'; // Assuming you have react-icons installed

interface StatCardProps {
  title: string;
  value: string;
  icon?: IconType; // Allow passing an icon as a prop
  className?: string;
}

const StatCard: FC<StatCardProps> = ({ title, value, icon: Icon, className }) => {
  return (
    <div className={`p-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl shadow-lg transform transition-transform hover:scale-105 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        {Icon && <Icon className="text-4xl opacity-75" />} {/* Render the icon if provided */}
      </div>
    </div>
  );
};

export default StatCard;
