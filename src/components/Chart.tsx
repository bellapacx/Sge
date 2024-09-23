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
      <div className="bg-white border border-gray-200 rounded-lg shadow-md p-3">
        <p className="text-gray-700 font-semibold">{`Date: ${payload[0].payload.date}`}</p>
        <p className="text-blue-600 font-bold">{`Total Sales: ₦${payload[0].value.toLocaleString()}`}</p>
      </div>
    );
  }
  return null;
};

const Chart: React.FC<ChartProps> = ({ salesData }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
        <CartesianGrid strokeDasharray="4 4" stroke="#e0e0e0" />
        <XAxis dataKey="date" tick={{ fill: '#8884d8' }} />
        <YAxis tick={{ fill: '#8884d8' }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{
            paddingTop: 10,
            color: '#4a90e2',
          }}
        />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#4a90e2"
          strokeWidth={2.5}
          dot={{ stroke: '#4a90e2', strokeWidth: 3, r: 4 }}
          activeDot={{ r: 7, fill: '#4a90e2', stroke: '#ffffff', strokeWidth: 2 }}
        />
        <Brush dataKey="date" height={20} stroke="#4a90e2" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Chart;
