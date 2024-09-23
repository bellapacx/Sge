import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface SalesData {
  date: string;
  total: number;
}

interface ChartProps {
  salesData: SalesData[];
}

const Chart: React.FC<ChartProps> = ({ salesData }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={salesData}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="total" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Chart;
