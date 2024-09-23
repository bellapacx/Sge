import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  Brush,
} from 'recharts';

interface SalesData {
  date: string;
  total: number;
}

interface ChartProps {
  salesData: SalesData[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { payload: SalesData; value: number }[];
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-300 rounded shadow-lg p-2">
        <p className="text-black">{`Date: ${payload[0].payload.date}`}</p>
        <p className="text-black">{`Total Sales: ₦${payload[0].value.toLocaleString()}`}</p>
      </div>
    );
  }
  return null;
};

const Chart: React.FC<ChartProps> = ({ salesData }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={salesData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#4a90e2"
          strokeWidth={3}
          dot={{ stroke: '#4a90e2', strokeWidth: 2 }}
          activeDot={{ r: 6 }}
        />
        <Brush dataKey="date" height={30} stroke="#4a90e2" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Chart;
