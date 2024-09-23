import React from 'react';
import { Line } from 'react-chartjs-2';

interface ChartProps {
  salesData: { date: string; total: number }[];
}

const Chart: React.FC<ChartProps> = ({ salesData }) => {
  // Prepare data for chart
  const labels = salesData.map(data => data.date);
  const totals = salesData.map(data => data.total);

  const data = {
    labels,
    datasets: [
      {
        label: 'Sales by Date',
        data: totals,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 1,
      },
    ],
  };

  return <Line data={data} />;
};

export default Chart;
